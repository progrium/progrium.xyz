// A project's page: its story (the file's body), then everything tagged with it.
// A project file with no body is only an entry on /projects, so its page just
// points there. (taragen has no way to list a page without writing it.)
data({ redirectTo: page.isDir || stripTags(page.body).trim() ? null : `/projects#${page.slug}` });
(content) => {
  if (page.isDir) return content;
  if (page.redirectTo) return <p><a href={page.redirectTo}>{page.title}</a> is listed on <a href="/projects">projects</a>.</p>;
  const tag = page.tag || page.slug;
  const tagged = entries(pages({ path: ["articles/**", "logs/**", "docs/**"] })).filter(e => (e.tags || []).includes(tag));
  const links = [page.website && <a href={page.website}>website ↗</a>, page.source && <a href={page.source}>source ↗</a>].filter(Boolean);
  const related = page.related || page.tags || [];
  return (
    <div class="hub">
      <div class="hub-meta">{[page.emoji && `${page.emoji} project`, page.years, page.status].filter(Boolean).join(" · ")}</div>
      <h1 class="pixel-h1">{page.title}</h1>
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
