(content) => {
  const kind = kindOf(page);
  const title = page.path === "/" ? "progrium" : `${page.title || entryTitle(page)} · progrium`;
  const description = page.description || (isEntry(page) ? dek(page) : siteDescription);
  return (
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <script>{`try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}`}</script>
    <link rel="preload" href="/_assets/fonts/Recursive.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
    <link rel="stylesheet" href="/_assets/style.css" />
    <script src="/_assets/site.js" defer={true}></script>
    <link rel="icon" href="/_assets/glider.svg" />
    <link rel="alternate" type="application/rss+xml" title="progrium.xyz: everything" href="/feed.xml" />
    <link rel="alternate" type="application/rss+xml" title="progrium.xyz: articles" href="/articles/feed.xml" />
    <link rel="alternate" type="application/rss+xml" title="progrium.xyz: logs" href="/logs/feed.xml" />
    {page.outputs?.txt && <link rel="alternate" type="text/plain" href={page.outputs.txt} />}
    <link rel="canonical" href={`${page.siteURL}${page.path}`} />
    <meta property="og:site_name" content={siteTitle} />
    <meta property="og:type" content={kind === "article" ? "article" : "website"} />
    <meta property="og:title" content={page.path === "/" ? "Jeff Lindsay" : (page.title || entryTitle(page))} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={`${page.siteURL}${page.path}`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="@progrium" />
    {page.outputs?.card && <meta property="og:image" content={`${page.siteURL}${page.outputs.card}`} />}
    {page.outputs?.card && <meta property="og:image:width" content="1200" />}
    {page.outputs?.card && <meta property="og:image:height" content="630" />}
    {page.date && <meta property="article:published_time" content={`${page.date}T00:00:00Z`} />}
  </head>
  <body>
    <div class="site">
      <header class="head">
        <a class="wordmark" href="/">progrium</a>
        <span class="who">Jeff Lindsay</span>
        {partial("_partials/nav")}
      </header>
      <main>{content}</main>
      {partial("_partials/footer")}
    </div>
  </body>
</html>
  );
}
