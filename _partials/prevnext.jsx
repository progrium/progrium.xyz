// Previous and next within a list (oldest first), labelled the way logs and
// articles want: articles by title, logs by date and first sentence.
(list, label = "More") => {
  const i = list.findIndex(p => p.path === page.path);
  if (i < 0) return null;
  const prev = list[i - 1], next = list[i + 1];
  if (!prev && !next) return null;
  const dated = (p) => kindOf(p) !== "article";
  return (
    <nav class="prevnext" aria-label={label}>
      {prev && <a href={prev.path} class="prev"><span class="pn-k">← previous{dated(prev) ? ` · ${shortDate(prev.date)}` : ""}</span>{entryTitle(prev)}</a>}
      {next && <a href={next.path} class="next"><span class="pn-k">next →{dated(next) ? ` · ${shortDate(next.date)}` : ""}</span>{entryTitle(next)}</a>}
    </nav>
  );
}
