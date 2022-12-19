import { walk } from "https://deno.land/std/fs/mod.ts";
import { extname, dirname } from "https://deno.land/std/path/mod.ts";
import { copy } from "https://deno.land/std/fs/copy.ts";

import render from "npm:mithril-node-render";
import pretty from "npm:pretty";
import showdown from "npm:showdown";
import matter from "npm:gray-matter";

import {m} from "../deps.ts";
import site from "../site.ts";
import layout from "../layouts/global.tsx";

export async function generateAll(outpath: string) {
  const _dirname = new URL('.', import.meta.url).pathname;
  try {
    Deno.mkdirSync(outpath, { recursive: true });
  } catch {}
  copy(`${_dirname}/../static`, `${outpath}/static`, {overwrite: true});
  
  const iter = walk(`${_dirname}/../pages`, {
    includeDirs: false,
    exts: ['.md', '.tsx'],
  });
  for await(const e of iter) {
    if(e.isFile) {
      const pathname = e.path.replace(Deno.cwd(), "").replace("/pages", "").replace(extname(e.path), "");
      const out = await generate(pathname);
      if (out) {
        const target = `${outpath}${pathname}${pathname.endsWith("/index")?"":"/index"}.html`;
        try {
          Deno.mkdirSync(dirname(target), { recursive: true });
        } catch {}
        await Deno.writeTextFile(target, out);
      }
    }
  }
}

export async function generate(path: string): string|undefined {
  const dirname = new URL('.', import.meta.url).pathname;
  const pathname = `${dirname}/../pages${path}`;
  try {
    // markdown
    const text = await Deno.readTextFile(`${pathname}.md`);
    const page = matter(text);
    const converter = new showdown.Converter();

    const MarkdownPage: m.Component = {
      view(vnode) {
        return m(layout, {site: site, page: page.data}, m.trust(converter.makeHtml(page.content)));
      }
    };

    return pretty(render.sync(MarkdownPage));
  } catch(e) {
    //console.log(e, path);
  }
  
  try {
    // tsx/component
    const page = await import(`../pages${path}.tsx`);
    return pretty(render.sync(m(page.default, {site})));
  } catch(e) {
    //console.log(e);
  }

  return undefined;
}

