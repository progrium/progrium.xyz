// A tag hub. Generated for every tag; add tags/<tag>.md to give one a write-up.
(content) => {
  if (page.isDir) return content;
  const tag = isGenerated(page) ? page.params.tag : page.slug;
  const tagged = entries(pages({ path: ["articles/**", "logs/**", "docs/**"] })).filter(e => (e.tags || []).includes(tag));
  const projs = projectList(pages("projects")).filter(p => (p.tags || []).includes(tag) || p.slug === tag);
  const n = (k, w) => `${k} ${w}${k === 1 ? "" : "s"}`;
  return (
    <div class="hub">
      <div class="hub-meta">{["tag", projs.length > 0 && n(projs.length, "project"), n(tagged.length, "entry").replace("entrys", "entries")].filter(Boolean).join(" · ")}</div>
      <h1 class="pixel-h1">{page.heading || tag}</h1>
      {stripTags(String(content)).trim() && <div class="story body">{content}</div>}
      {projs.length > 0 && <>
        <h2 class="sec">projects</h2>
        <p class="hub-projs">{projs.map(p => <a href={projectHref(p)}>{p.emoji} {p.title}</a>)}</p>
      </>}
      <h2 class="sec">tagged {tag}</h2>
      {partial("_partials/stream", tagged)}
    </div>
  );
}
