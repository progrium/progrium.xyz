data({ title: "About", description: "Jeff Lindsay, aka progrium: twenty years of developer tools, open source, and small things meant to be composed into bigger ones." });
{(() => {
  // The timeline. Newest first; month is optional.
  const timeline = [
    ["2025", [["🧩", "May", "Wanix rebuilt around Plan 9 ideas", "/articles/2025/spirit-of-plan9-on-the-web"],
              ["✍️", "Mar", "State of Tractor 2025", "/articles/2025/state-of-tractor-2025"]]],
    ["2023", [["🌳", "Feb", "Treehouse announced", "/articles/2023/welcome-to-treehouse"]]],
    ["2022", [["🪟", "Jul", "Apptron, the first building block of Tractor", "/articles/2022/cross-platform-native-apis-made-accessible-with-apptron"]]],
    ["2021", [["💬", "Aug", "qtalk-go beta", "/articles/2021/making-programs-interact-using-qtalk"],
              ["🍎", "Feb", "macdriver alpha", "/articles/2021/use-mac-apis-and-build-mac-apps-with-go"]]],
    ["2020", [["🚜", "", "Heads down on Tractor"]]],
    ["2013", [["🐳", "", "Dokku"]]],
    ["2010", [["🚇", "", "localtunnel"]]],
    ["2009", [["🏠", "", "Helped start Hacker Dojo"]]],
    ["2007", [["🪝", "", "First talk on webhooks"]]],
  ];
  const link = (name) => elsewhere.find(e => e[0] === name)[1];
  return <>
    <div class="about-top">
      <img class="portrait" alt="Jeff Lindsay" src="/_assets/photo.jpeg" width="150" />
      <div>
        <h1 class="pixel-h1">about</h1>
        <p>I'm Jeff Lindsay. Online I go by progrium. I've spent about twenty years building developer tools and open source infrastructure, usually small things meant to be composed into bigger ones.</p>
        <p>Some of it you may have used: webhooks, localtunnel, Dokku. Since 2020 most of my work has gone into Tractor, a search for simpler ways to build software. Wanix, Apptron and h9 all come out of that.</p>
        <p>Otherwise I make indie games and music. Someday I'd like to make films.</p>
        <dl class="dl">
          <dt>write to</dt><dd><a href={link("email")}>email</a><a href="https://discord.gg/JraBdNHuuP">Discord</a></dd>
          <dt>follow</dt><dd><a href={link("mastodon")}>Mastodon</a><a href={link("bsky")}>Bluesky</a><a href={link("github")}>GitHub</a><a href="https://www.youtube.com/c/progrium">YouTube</a><a href="/feeds">RSS</a></dd>
          <dt>support</dt><dd><a href="https://github.com/sponsors/progrium">GitHub Sponsors</a></dd>
          <dt>colophon</dt><dd><span>Set in Recursive and Silkscreen, built with <a href="https://github.com/progrium/taragen">taragen</a></span></dd>
        </dl>
      </div>
    </div>
    <div class="tl" id="timeline">
      <h2 class="sec">timeline</h2>
      {timeline.map(([year, events]) =>
        <div class="yeargroup">
          <div class="yr">{year}</div>
          <div class="stream">
            {events.map(([g, month, text, href]) =>
              <div class="ev"><span aria-hidden="true">{g}</span><span class="meta">{month || "—"}</span><span>{href ? <a href={href}>{text}</a> : text}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  </>;
})()}
