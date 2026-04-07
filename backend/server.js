import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

const allowedOrigins = [
    "https://exodraft.com.ua",
    "https://www.exodraft.com.ua",
    "http://localhost:8080"
];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;
const PORT = process.env.PORT || 3001;

if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Missing env vars: TG_BOT_TOKEN, TG_CHAT_ID");
    process.exit(1);
}

function clean(s, max) {
    return String(s || "").replace(/\s+/g, " ").trim().slice(0, max);
}

// ===== Anti-spam: rate limit + honeypot =====
const lastByIp = new Map(); // ip -> timestamp(ms)
const WINDOW_MS = 30000;   // 30 секунд

function getClientIp(req) {
    const xff = req.headers["x-forwarded-for"];
    if (typeof xff === "string" && xff.length > 0) {
        return xff.split(",")[0].trim();
    }
    return req.socket.remoteAddress || "unknown";
}

app.use((req, res, next) => {
    if (req.method !== "POST") return next();

    const ip = getClientIp(req);
    const now = Date.now();
    const last = lastByIp.get(ip) || 0;

    if (now - last < WINDOW_MS) {
        const waitSec = Math.ceil((WINDOW_MS - (now - last)) / 1000);
        return res.status(429).send(`Занадто часто. Спробуйте через ${waitSec} с.`);
    }

    lastByIp.set(ip, now);
    next();
});

app.post("/api/call-request", async (req, res) => {
    const name = clean(req.body?.name, 80);
    const phone = clean(req.body?.phone, 30);
    const message = clean(req.body?.message, 500);
    const page = clean(req.body?.page, 300);
    const website = clean(req.body?.website, 120);

    if (name.length < 2 || phone.length < 6) {
        return res.status(400).send("Invalid input");
    }

    if (website.length > 0) {
        return res.status(200).send("ok");
    }

    const text =
        `📞 Нова заявка на дзвінок
👤 Ім’я: ${name}
☎️ Телефон: ${phone}
💬 Повідомлення: ${message || "—"}
🌐 Сторінка: ${page}
⏱ Час: ${new Date().toLocaleString("uk-UA")}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    if (!tgRes.ok) {
        const t = await tgRes.text().catch(() => "");
        return res.status(502).send(t || "Telegram error");
    }

    res.status(200).send("ok");
});

app.listen(PORT, () => console.log(`API running: http://localhost:${PORT}`));