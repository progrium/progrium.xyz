// "reply on GitHub" on the left; on the right, either what links here or a
// link back to the month (for logs).
(right) =>
<div class="reply-row">
  <a class="key" href={discussionFor(page) || discussionsURL}>reply on GitHub ↗</a>
  {right}
</div>
