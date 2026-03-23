// netlify/functions/call-request.js
exports.handler = async (event) => {
    try {
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                body: "",
            };
        }

        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                headers: { "Content-Type": "text/plain" },
                body: "Method Not Allowed",
            };
        }

        const BOT_TOKEN = process.env.TG_BOT_TOKEN;
        const CHAT_ID = process.env.TG_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            return {
                statusCode: 500,
                headers: { "Content-Type": "text/plain" },
                body: "Missing TG env vars",
            };
        }

        const body = JSON.parse(event.body || "{}");

        const clean = (s, max) =>
            String(s || "").replace(/\s+/g, " ").trim().slice(0, max);

        const name = clean(body.name, 80);
        const phone = clean(body.phone, 30);
        const message = clean(body.message, 500);
        const page = clean(body.page, 300);
        const website = clean(body.website, 120); // honeypot

        if (name.length < 2 || phone.length < 6) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "text/plain" },
                body: "Invalid input",
            };
        }

        // honeypot
        if (website.length > 0) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain" },
                body: "ok",
            };
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
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text,
            }),
        });

        if (!tgRes.ok) {
            const t = await tgRes.text().catch(() => "");
            return {
                statusCode: 502,
                headers: { "Content-Type": "text/plain" },
                body: t || "Telegram error",
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain" },
            body: "ok",
        };
    } catch (e) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "text/plain" },
            body: "Server error",
        };
    }
};