// Entries grouped by year, newest first. `excerpt` shows an article's first
// paragraph and a keycap to the full post instead of its one-line dek.
(list, excerpt = false) => groupByYear(list).map(g =>
  <div class="yeargroup">
    <div class="yr">{g.year}</div>
    <div class={excerpt ? "stream excerpts" : "stream"}>{g.items.map(p => partial("_partials/entry", p, false, excerpt))}</div>
  </div>
)
