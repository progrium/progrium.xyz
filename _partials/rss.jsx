// An RSS feed of the given entries.
(title, list) =>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>{title}</title>
    <link>{page.siteURL}</link>
    <atom:link href={`${page.siteURL}${page.path}`} rel="self" type="application/rss+xml" />
    <description>{siteDescription}</description>
    <language>en</language>
    {list.slice(0, 50).map(p => {
      const kind = kindOf(p);
      const url = `${page.siteURL}${p.path}`;
      const body = (kind === "link" || kind === "video") ? `<p><a href="${p.link}">${p.title || p.link}</a></p>${p.body}` : p.body;
      return (
        <item>
          <title>{kind === "article" || kind === "doc" ? p.title : (p.title ? `${p.title} ↗` : entryTitle(p))}</title>
          <link>{url}</link>
          <guid isPermaLink="true">{url}</guid>
          <pubDate>{new Date(p.date).toUTCString()}</pubDate>
          {p.description && <description>{p.description}</description>}
          <content:encoded>{raw(`<![CDATA[${body}]]>`)}</content:encoded>
        </item>
      );
    })}
  </channel>
</rss>
