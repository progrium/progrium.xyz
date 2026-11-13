// 1200×630 share card: wordmark, title, and where it's from.
data({ scale: 1 });
() => {
  const W = 1200, H = 630, X = 80;
  const kind = kindOf(page);
  const isLog = kind === "log" || kind === "link" || kind === "video";
  const text = page.path === "/" ? "Jeff Lindsay makes simple tools that make computers more programmable."
    : isLog ? entryTitle(page) : (page.title || siteTitle);
  const font = isLog
    ? { family: "Recursive", size: 54, weight: 500 }
    : { family: "Recursive", size: 76, weight: 800 };
  const lh = isLog ? 72 : 84;
  const lines = wrap(text, font, W - 2 * X - 60).slice(0, isLog ? 5 : 4);
  const top = 250 - (isLog ? 30 : 0);
  const meta = ["progrium.xyz", kind !== "page" ? kind : null, page.date].filter(Boolean).join(" · ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect width={W} height={H} fill="#fff" />
      <text x={X} y="112" font-family="Silkscreen" font-weight="700" font-size="40" fill="#111">PROGRIUM</text>
      <text font-family="Recursive" font-size={font.size} font-weight={font.weight} fill="#111"
        font-variation-settings={isLog ? "'MONO' 0, 'CASL' 1" : "'MONO' 0, 'CASL' 0"} letter-spacing={isLog ? 0 : -1.5}>
        {lines.map((line, i) => <tspan x={X} y={top + i * lh}>{line}</tspan>)}
      </text>
      <text x={X} y="560" font-family="Recursive" font-size="28" fill="#777" font-variation-settings="'MONO' 1">{meta}</text>
    </svg>
  );
}
