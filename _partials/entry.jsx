// One entry in a stream. `full` shows a log's whole body (the logs index)
// instead of its first paragraph, and dates link to the entry.
(p, full = false) => {
  const kind = kindOf(p);
  const date = full
    ? <a class="permalink" href={p.path}>{p.date}</a>
    : <time datetime={p.date}>{shortDate(p.date)}</time>;
  const meta = (extra) => <div class="meta">{date}{!full && <span class="k">{kind}</span>}{extra}</div>;
  const paras = paragraphs(p.body);

  if (kind === "article" || kind === "doc") return (
    <article class={`e e-article e-${kind}`}>
      {meta(kind === "article" && <span class="len">{minutes(p)} min</span>)}
      <div class="e-body">
        <h3><a href={p.path}>{p.title}</a></h3>
        <p class="dek">{dek(p)}</p>
      </div>
    </article>
  );

  if (kind === "link" || kind === "video") {
    const yt = youtubeID(p.link);
    return (
      <article class={`e e-link e-${kind}`}>
        {meta(null)}
        <div class="e-body">
          <h3><a href={p.link}>{p.title || p.link} ↗</a><span class="src">{domain(p.link)}</span></h3>
          {yt && partial("_partials/youtube", yt, p.title || "")}
          {raw(p.body)}
          {!full && <a class="cont" href={p.path}>permalink</a>}
        </div>
      </article>
    );
  }

  // a log
  const more = paras.length - 1;
  return (
    <article class="e e-log">
      {meta(p.emoji && <span class="mark">{p.emoji}</span>)}
      <div class="e-body">
        {p.title && <h3><a href={p.path}>{p.title}</a></h3>}
        {full || more <= 0 ? raw(p.body) : raw(paras[0])}
        {!full && more > 0 && <a class="cont" href={p.path}>continue ({more} more ¶)</a>}
      </div>
    </article>
  );
}
