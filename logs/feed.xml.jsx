data({ preamble: '<?xml version="1.0" encoding="UTF-8"?>', contentType: "application/rss+xml", layout: "", aliases: [] });
{partial("_partials/rss", "progrium.xyz: logs", entries(pages({ path: ["logs/**"] })))}
