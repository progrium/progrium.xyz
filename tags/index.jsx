data({ title: "Tags" });
{(() => {
  const counts = {};
  entries(pages({ path: ["articles/**", "logs/**", "docs/**"] })).forEach(p => (p.tags || []).forEach(t => counts[t] = (counts[t] || 0) + 1));
  return <p class="hub-projs">{Object.keys(counts).sort().map(t => <><a href={`/tags/${t}`}>{t}</a> <span class="yrs">{counts[t]}</span> </>)}</p>;
})()}
