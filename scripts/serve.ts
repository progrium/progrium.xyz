
const port = 9000;

import { serve } from "https://deno.land/std/http/server.ts";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { generate } from "./generate.ts";
import site from "../site.ts";

site.dev = true;

const middleware = refresh();

await serve(async (req) => {
  const res = middleware(req);
  if (res) return res;

  let pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "static",
      urlRoot: "static"
    });
  }
  if (pathname.endsWith("/")) {
    pathname = pathname+"index";
  }


  const out = await generate(pathname);
  if (out) {
    return new Response(out, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });  
  }
  return new Response("Not found", {
    status: 404,
    headers: {
      "content-type": "text/html",
    },
  });
}, { port });