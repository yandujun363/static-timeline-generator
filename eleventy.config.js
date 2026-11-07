import ejsPlugin from '@11ty/eleventy-plugin-ejs';

/**
 * Eleventy 3 configuration (ESM).
 *
 * CSS and JavaScript are authored as modern, dependency-free assets and copied
 * through as-is — no Sass build step required.
 */
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(ejsPlugin);

  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'src/img': 'img' });

  eleventyConfig.addWatchTarget('src/css/**/*.css');
  eleventyConfig.addWatchTarget('src/js/**/*.js');

  eleventyConfig.setServerOptions({ port: 8080 });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    templateFormats: ['ejs', 'html', 'md'],
    htmlTemplateEngine: 'ejs',
    markdownTemplateEngine: 'ejs',
  };
}
