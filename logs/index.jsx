data({ title: "Logs", description: "Short, untitled journal entries. What I'm doing, thinking, and sharing." });
{(() => {
  const all = entries(pages({ path: ["logs/**"] }));
  if (!all.length) return <p class="casual">Nothing logged yet. Soon.</p>;
  const ym = all[0].date.slice(0, 7);
  const month = all.filter(p => p.date.startsWith(ym));
  const older = all.find(p => !p.date.startsWith(ym));
  return <>
    {partial("_partials/journal", month)}
    {older && <p class="more"><a href={`/logs/${older.date.slice(0, 4)}/${older.date.slice(5, 7)}`}>{monthName(older.date.slice(5, 7))} {older.date.slice(0, 4)} →</a></p>}
  </>;
})()}
