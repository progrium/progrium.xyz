data({ preamble: '<?xml version="1.0" encoding="UTF-8"?>', contentType: "application/rss+xml", layout: "" });
{partial("_partials/rss", "progrium.xyz", entries(pages({ path: ["articles/**", "logs/**", "docs/**"] })))}
