// A YouTube video that loads nothing from YouTube until you press play.
// From Markdown: [[ partial "_partials/youtube" "VIDEO_ID" ]]
(id, title = "") =>
<a class="vid" href={`https://www.youtube.com/watch?v=${id}`} data-yt={id} data-title={title} aria-label={`Play video${title ? `: ${title}` : ""}`}>
  <span class="play" aria-hidden="true"></span>
  {title && <span class="vt">{title}</span>}
  <span class="vs">youtube · loads when you press play</span>
</a>
