import lume from "lume/mod.ts";
import reload from "lume/middlewares/reload.ts";

import date from "lume/plugins/date.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import jsx_preact from "lume/plugins/jsx_preact.ts";
import mdx from "lume/plugins/mdx.ts";
import nav from "lume/plugins/nav.ts";

import lang_javascript from "https://unpkg.com/@highlightjs/cdn-assets@11.7.0/es/languages/javascript.min.js";
import lang_bash from "https://unpkg.com/@highlightjs/cdn-assets@11.7.0/es/languages/bash.min.js";
import lang_go from "https://unpkg.com/@highlightjs/cdn-assets@11.7.0/es/languages/go.min.js";

const site = lume({}, {
  search: { returnPageData: true }
});

site.use(code_highlight({
  languages: {
    javascript: lang_javascript,
    bash: lang_bash,
    go: lang_go
  }
}));
site.use(jsx_preact());
site.use(mdx());
site.use(date());
site.use(nav());

site.copy("_assets", ".");

site.data("site", "progrium.xyz");
site.data("cover_image", "https://progrium.xyz/photo_wide.png");

export default site;
