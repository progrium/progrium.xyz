data({
    layout: "_partials/xml",
    contentType: "application/rss+xml",
});
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/" version="2.0">
    <channel>
        <title>{site_title}</title>
        <link>{site_url}</link>
        <atom:link href={`${site_url}${page.path}`} rel="self" type="application/rss+xml"/>
        <description>{site_description}</description>
        <lastBuildDate>{new Date().toUTCString()}</lastBuildDate>
        <language>en</language>
        <generator>Taragen 0.1</generator>
        {pages("blog/*").reverse().map(post => (
            <item>
                <title>{post.title}</title>
                <link>{`${site_url}${post.path}`}</link>
                <guid isPermaLink="false">{`${site_url}${post.path}`}</guid>
                <description>{post.description}</description>
                <content:encoded>
                    {`<![CDATA[${post.body}]]>`}
                </content:encoded>
                <pubDate>{new Date(post.date).toUTCString()}</pubDate>
            </item>
        ))}
    </channel>
</rss>