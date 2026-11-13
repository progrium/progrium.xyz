// Full log entries under month headings, newest first.
(list) => {
  const groups = list.reduce((gs, p) => {
    const ym = p.date.slice(0, 7), last = gs[gs.length - 1];
    if (last && last.ym === ym) last.items.push(p); else gs.push({ ym, items: [p] });
    return gs;
  }, []);
  return (
    <div class="journal">
      {groups.map(g => <>
        <h2 class="sec jm"><a class="permalink" href={`/logs/${g.ym.slice(0, 4)}/${g.ym.slice(5, 7)}`}>{monthName(g.ym.slice(5, 7)).toLowerCase()} {g.ym.slice(0, 4)}</a></h2>
        {g.items.map(p => partial("_partials/entry", p, true))}
      </>)}
    </div>
  );
}
