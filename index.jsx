data({ title: "Jeff Lindsay", description: "Jeff Lindsay, aka progrium. I make simple tools that make computers more programmable." });
<div class="intro">
  <p>Hi, I'm Jeff. I make simple tools that make computers more programmable, and more an instrument for the imagination.</p>
  <p>I'm known for pioneering webhooks, prototyping Docker, building Dokku. Lately it's been Wanix and Plan 9 ideas.</p>
</div>
{now && <div class="now"><span class="now-k">presently</span> <span>{now}</span></div>}
{partial("_partials/newsletter", "home", "nl-home-email")}
<h2 class="sec">recently</h2>
{partial("_partials/stream", entries(pages({ path: ["articles/**", "logs/**"] })).slice(0, 12))}
<p class="more"><a href="/articles">all articles</a> · <a href="/logs">all logs</a> · <a href="/feeds">feeds</a></p>
