// "3 logs link here", opening into the list of what links here.
() => {
  const bl = (page.backlinks || []).filter(isEntry);
  if (!bl.length) return null;
  const logs = bl.filter(p => kindOf(p) !== "article" && kindOf(p) !== "doc").length;
  const noun = logs === bl.length ? (bl.length === 1 ? "log" : "logs") : (bl.length === 1 ? "page" : "pages");
  return (
    <details class="backlinks">
      <summary>{bl.length} {noun} link{bl.length === 1 ? "s" : ""} here</summary>
      <ul>{bl.map(p => <li><a href={p.path}>{p.date} · {entryTitle(p)}</a></li>)}</ul>
    </details>
  );
}
