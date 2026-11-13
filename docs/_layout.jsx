// Docs: proposals and longer ideas. Not in the nav; logs link to them.
(content) => {
  if (page.isDir) return content;
  const revisions = page.revisions || [];
  const linkedFrom = (page.backlinks || []).filter(isEntry);
  return (
    <article class="post doc">
      <div class="byline">{["doc", page.status, revisions.length && `revision ${revisions.length}`, `updated ${page.updated || page.date}`].filter(Boolean).join(" · ")}</div>
      <h1>{page.title}</h1>
      {page.description && <p class="doc-dek">{page.description}</p>}
      <div class="body">{content}</div>
      <div class="doc-foot meta">
        {linkedFrom.length > 0 && <span>linked from: {linkedFrom.map((p, i) => <>{i > 0 && ", "}<a href={p.path}>{kindOf(p)} {p.date}</a></>)}</span>}
        {revisions.length > 0 && <span>revisions: {revisions.map((r, i) => `r${revisions.length - i} ${r}`).join(" · ")}</span>}
      </div>
      {partial("_partials/replyrow", null)}
    </article>
  );
}
