module.exports = function (eleventyConfig) {
  // копируем статику как есть
    eleventyConfig.addPassthroughCopy({ "src/css": "css" });
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });
    eleventyConfig.addPassthroughCopy({ "src/img": "img" });

    return {
    dir: {
        input: "src",
        output: "dist",
        includes: "_includes"
    }
    };
};
