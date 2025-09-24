const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // copy styles folder to the root of the output
  eleventyConfig.addPassthroughCopy({"src/styles": "styles"});

  // a simple collection for posts (markdown files in src/posts)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort(function(a,b){
      return b.date - a.date;
    });
  });

  // Add a `date` filter for Nunjucks/Liquid templates.
  // Usage in templates: {{ page.date | date("YYYY") }} or {{ "now" | date("YYYY") }}
  eleventyConfig.addFilter("date", function(dateObj, format = "yyyy") {
    if (!dateObj) return "";

    // Map common Moment-style tokens to Luxon tokens (minimal mapping)
    let mappedFormat = String(format)
      .replace(/YYYY/g, 'yyyy')
      .replace(/YY/g, 'yy')
      .replace(/DD/g, 'dd');

    let dt;
    try {
      if (dateObj === "now") {
        dt = DateTime.now();
      } else if (dateObj instanceof Date) {
        dt = DateTime.fromJSDate(dateObj);
      } else {
        // try to parse strings/other formats
        dt = DateTime.fromISO(String(dateObj));
        if (!dt.isValid) dt = DateTime.fromJSDate(new Date(dateObj));
      }
      if (!dt || !dt.isValid) return String(dateObj);
      return dt.toFormat(mappedFormat);
    } catch (e) {
      return String(dateObj);
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "layouts",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md","njk","html"]
  };
};
