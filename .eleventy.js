module.exports = function (eleventyConfig) {
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/video": "video" });
  eleventyConfig.addPassthroughCopy({ "src/files": "files" });

  eleventyConfig.addFilter("date", (value, locale = "uk-UA") => {
  // value может быть Date, строкой или "now"
  const d = (value === "now" || !value) ? new Date() : new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  // Формат YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
});

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
  };
};

