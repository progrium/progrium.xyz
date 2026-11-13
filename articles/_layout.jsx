(content) => {
  if (page.isDir) return content; // the index
  const list = pages("articles/**").filter(isEntry);
  return (
    <article class="post">
      <h1>{page.html_title ? raw(page.html_title) : page.title}</h1>
      <div class="byline">
        <time datetime={page.date}>{page.date}</time> · {minutes(page)} min
        {page.tags?.length > 0 && <> · <span class="tags">{page.tags.map(t => <a href={`/tags/${t}`}>{t}</a>)}</span></>}
      </div>
      <div class="body">{content}</div>
      {partial("_partials/replyrow", partial("_partials/backlinks"))}
      {partial("_partials/newsletter", "box", "nl-article-email")}
      {partial("_partials/prevnext", list, "More articles")}
    </article>
  );
}
