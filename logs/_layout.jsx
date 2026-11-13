(content) => {
  if (page.isDir || !isEntry(page)) return content; // indexes and archives
  const kind = kindOf(page);
  const list = pages("logs/**").filter(isEntry);
  const ym = page.date.slice(0, 7);
  return (
    <article class={`post logpost e-${kind}`}>
      <div class="byline">
        <time datetime={page.date}>{page.date}</time> · {kind}
        {page.emoji && <> · {page.emoji}</>}
        {page.tags?.length > 0 && <> · <span class="tags">{page.tags.map(t => <a href={`/tags/${t}`}>{t}</a>)}</span></>}
      </div>
      {kind === "log" && page.title && <h1 class="log-h">{page.title}</h1>}
      {kind !== "log" && <h1 class="link-h"><a href={page.link}>{page.title || page.link} ↗</a><span class="src">{domain(page.link)}</span></h1>}
      {kind === "video" && partial("_partials/youtube", youtubeID(page.link), page.title || "")}
      <div class="e-body">{content}</div>
      {partial("_partials/replyrow", <a class="backlinks" href={`/logs/${ym.slice(0, 4)}/${ym.slice(5, 7)}`}>all of {monthName(ym.slice(5, 7))} {ym.slice(0, 4)}</a>)}
      {partial("_partials/prevnext", list, "More logs")}
    </article>
  );
}
