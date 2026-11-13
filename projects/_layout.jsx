// A project's own page: a hand-written story, then everything tagged with it.
(content) => {
  if (page.isDir) return content;
  const p = projectBySlug(page.slug) || { name: page.title, g: "", slug: page.slug };
  const tag = page.tag || p.slug;
  const tagged = entries(pages({ path: ["articles/**", "logs/**", "docs/**"] })).filter(e => (e.tags || []).includes(tag));
  const links = [p.website && <a href={p.website}>website ↗</a>, p.source && <a href={p.source}>source ↗</a>].filter(Boolean);
  const related = page.related || p.tags || [];
  return (
    <div class="hub">
      <div class="hub-meta">{[p.g && `${p.g} project`, p.years, p.status].filter(Boolean).join(" · ")}</div>
      <h1 class="pixel-h1">{p.name}</h1>
      {links.length > 0 && <div class="pl hub-links">{links.map((l, i) => <>{i > 0 && " · "}{l}</>)}</div>}
      <div class="story body">{content}</div>
      {tagged.length > 0 && <>
        <h2 class="sec">tagged {tag}</h2>
        {partial("_partials/stream", tagged)}
      </>}
      {related.length > 0 && <p class="more">related: {related.map((t, i) => <>{i > 0 && " · "}<a href={`/tags/${t}`}>{t}</a></>)}</p>}
    </div>
  );
}
