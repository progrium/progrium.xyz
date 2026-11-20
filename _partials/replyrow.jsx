// "reply on GitHub" on the left, only when the page sets discuss_url in its
// front matter. On the right, either what links here or a link back to the
// month (for logs). The row is left out when it would be empty.
(right) => (page.discuss_url || right) ?
<div class="reply-row">
  {page.discuss_url ? <a class="key" href={page.discuss_url}>reply on GitHub ↗</a> : <span></span>}
  {right}
</div> : null
