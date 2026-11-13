<footer class="foot">
  <span>[ {page.outputs?.txt
    ? <a href={page.outputs.txt} title="this page as plain text">txt</a>
    : <span>txt</span>} · <a href="/feeds" title="feeds">rss</a> · <a href="/newsletter">newsletter</a> ]</span>
  <span class="elsewhere">{elsewhere.map(([name, href]) => <a href={href}>{name}</a>)}</span>
  <span class="tended">
    <span class="keys">
      <button type="button" class="key small" id="modekey" aria-label="switch between light and dark">◐ <span class="mk-l">dark</span></button>
      <button type="button" class="key small" title="9/ux isn't ready yet: soon you'll be able to browse this site as files" disabled={true}>🖥️ boot 9/ux</button>
    </span>
    <span>last tended {today()} · <span class="built">built with <a href="https://progrium.github.io/taragen/">taragen</a></span></span>
  </span>
</footer>
