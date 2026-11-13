siteTitle = "progrium.xyz";
siteDescription = "Jeff Lindsay, aka progrium. Simple tools that make computers more programmable.";

// The one-line "now" on the homepage. Edit freely.
now = "🐇 getting h9 ready for a first preview";

// Logs share one GitHub discussion per month. Add a line when you open a new one.
// Months without one link to the discussions index.
logDiscussions = {
  // "2026-11": "https://github.com/progrium/progrium.xyz/discussions/3",
};
discussionsURL = "https://github.com/progrium/progrium.xyz/discussions";

newsletterAction = "https://progrium.us13.list-manage.com/subscribe/post?u=0dda02db0663c0132866c08ae&id=f964b318bd";
newsletterHoneypot = "b_0dda02db0663c0132866c08ae_f964b318bd";

elsewhere = [
  ["email", "mailto:progrium+web@gmail.com"],
  ["github", "https://github.com/progrium"],
  ["mastodon", "https://mas.to/@progrium"],
  ["bsky", "https://bsky.app/profile/progrium.xyz"],
  ["x", "https://x.com/progrium"],
];

// Projects. `page: true` means there's a hand-written page at /projects/<slug>.
// `tag` is the tag whose entries show up on that page (defaults to the slug).
projects = [
  { group: "now", slug: "h9", g: "🐇", name: "h9", years: "2026–", status: "preview soon",
    d: "Native 9front executables on host hypervisors.", tags: ["plan9"] },
  { group: "now", slug: "wanix", g: "🧩", name: "Wanix", years: "2023–", status: "in preview",
    d: "A Plan 9 inspired primitive for building environments in the browser.",
    source: "https://github.com/tractordev/wanix", tags: ["plan9", "tractor"] },
  { group: "now", slug: "apptron", g: "🪟", name: "Apptron", years: "2022–",
    d: "Native APIs and an app shell for software built with web tech.",
    website: "https://apptron.dev/", tags: ["tractor"] },
  { group: "now", slug: "tractor", g: "🚜", name: "Tractor", years: "2020–",
    d: "The long project all of the above belongs to: simpler ways to build software.",
    website: "https://tractor.dev/" },
  { group: "earlier", slug: "treehouse", g: "🌳", name: "Treehouse", years: "2023",
    d: "An open source, hackable outliner frontend.",
    website: "https://treehouse.sh/", source: "https://github.com/treehousedev/treehouse" },
  { group: "earlier", slug: "qtalk", g: "💬", name: "qtalk", years: "2021",
    d: "Making programs talk to each other over one connection.",
    source: "https://github.com/progrium/qtalk-go" },
  { group: "earlier", slug: "macdriver", g: "🍎", name: "macdriver", years: "2021",
    d: "Mac APIs and native Mac apps from Go.",
    source: "https://github.com/progrium/macdriver" },
  { group: "earlier", slug: "dokku", g: "🐳", name: "Dokku", years: "2013",
    d: "The smallest PaaS you've ever seen. A Docker-powered mini-Heroku.",
    website: "https://dokku.com/", source: "https://github.com/dokku/dokku" },
  { group: "earlier", slug: "localtunnel", g: "🚇", name: "localtunnel", years: "2010",
    d: "Expose localhost to the world. The original.",
    source: "https://github.com/progrium/localtunnel" },
  { group: "earlier", slug: "webhooks", g: "🪝", name: "Webhooks", years: "2007",
    d: "An idea more than a project. Pipes for the web." },
  { group: "not code", slug: "music", g: "🎹", name: "Music",
    d: "Tracks on SoundCloud.", website: "https://soundcloud.com/progrium" },
  { group: "not code", slug: "games", g: "🎮", name: "Games",
    d: "Small indie games on itch.io.", website: "https://progrium.itch.io/" },
  { group: "not code", slug: "communities", g: "🏠", name: "SuperHappyDevHouse, Hacker Dojo",
    d: "Communities I helped start." },
];
projectBySlug = (slug) => projects.find(p => p.slug === slug);

// ---------- dates ----------
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
monthName = (mm) => months[Number(mm) - 1];
shortDate = (date) => `${months[Number(date.slice(5, 7)) - 1].slice(0, 3)} ${date.slice(8, 10)}`;
today = () => new Date().toISOString().slice(0, 10);

// ---------- entries ----------
// What kind of thing a page is. Articles live in /articles, docs in /docs.
// In /logs, an entry with a `link` is a share; everything else is a log.
kindOf = (p) => {
  if (p.path.startsWith("/articles/")) return "article";
  if (p.path.startsWith("/docs/")) return "doc";
  if (p.path.startsWith("/logs/")) {
    if (p.link) return youtubeID(p.link) ? "video" : "link";
    return "log";
  }
  return "page";
};
// Generated pages carry a params object. (Real pages from pages() currently
// expose params as a function, so `!p.params` alone doesn't work.)
isGenerated = (p) => !!p.params && typeof p.params === "object";
isEntry = (p) => !isGenerated(p) && !p.isDir && !!p.date && !p.contentType && ["article", "log", "link", "video", "doc"].includes(kindOf(p));
// Globals run in their own VM without pages(), so callers pass the listing in:
// entries(pages({ path: [...] }))
entries = (list) => list.filter(isEntry).reverse();

stripTags = (html) => (html || "").replace(/<[^>]+>/g, "").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
paragraphs = (html) => ((html || "").match(/<p[\s>][\s\S]*?<\/p>/g) || []);
firstSentence = (text) => {
  const m = text.match(/^[\s\S]*?[.!?…](\s|$)/);
  return (m ? m[0] : text).trim();
};
clip = (text, n) => text.length > n ? text.slice(0, n).replace(/\s+\S*$/, "") + "…" : text;
minutes = (p) => Math.max(1, Math.round(stripTags(p.body).split(/\s+/).length / 230));
dek = (p) => p.description || clip(firstSentence(stripTags(paragraphs(p.body)[0] || "")), 180);
// A log's name, wherever a title is needed: its first sentence.
entryTitle = (p) => p.title || clip(firstSentence(stripTags(paragraphs(p.body)[0] || "")), 90) || p.date;

domain = (url) => { const m = (url || "").match(/^https?:\/\/(?:www\.)?([^/]+)/); return m ? m[1] : ""; };
youtubeID = (url) => {
  const m = (url || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? m[1] : null;
};

discussionFor = (p) => p.comment_url || (kindOf(p) === "log" || kindOf(p) === "link" || kindOf(p) === "video"
  ? logDiscussions[p.date.slice(0, 7)] || discussionsURL
  : null);

groupByYear = (list) => list.reduce((groups, p) => {
  const y = p.date.slice(0, 4);
  const last = groups[groups.length - 1];
  if (last && last.year === y) last.items.push(p);
  else groups.push({ year: y, items: [p] });
  return groups;
}, []);

// ---------- share cards ----------
wrap = (text, font, width) => text.split(/\s+/).reduce((lines, word) => {
  const last = lines[lines.length - 1];
  if (last !== undefined && measureText(`${last} ${word}`, font) <= width) lines[lines.length - 1] = `${last} ${word}`;
  else lines.push(word);
  return lines;
}, []);
