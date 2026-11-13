data({ contentType: "text/plain; charset=utf-8" });
() => {
  const src = (page.src || "").replace(/^---\n[\s\S]*?\n---\n/, "").trim();
  const head = page.title || entryTitle(page);
  const meta = [page.date, kindOf(page) !== "page" && kindOf(page), page.link].filter(Boolean).join(" · ");
  // JSX pages are templates, not prose: point at the page instead of dumping code.
  const text = page.src && /^\s*(---|[^<{(]|$)/.test(page.src) && !/\.jsx$/.test(page.path)
    ? src : stripTags(page.body).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return `${head}\n${meta ? meta + "\n" : ""}\n${text}\n\n-- \n${page.siteURL}${page.path}\n`;
}
