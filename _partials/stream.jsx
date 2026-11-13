// Entries grouped by year, newest first.
(list) => groupByYear(list).map(g =>
  <div class="yeargroup">
    <div class="yr">{g.year}</div>
    <div class="stream">{g.items.map(p => partial("_partials/entry", p))}</div>
  </div>
)
