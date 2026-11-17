// 1200×630 share card: wordmark, glider, title, and where it's from.
// Log entries also get their emoji, a link's ↗ and domain, and a snippet.
data({ scale: 1 });
() => {
  const W = 1200, H = 630, X = 80;
  const kind = kindOf(page);
  const isLog = kind === "log" || kind === "link" || kind === "video";
  const meta = ["progrium.xyz", kind !== "page" ? kind : null, page.date].filter(Boolean).join(" · ");
  const glider = (
    <svg x={W - X - 78} y="472" width="78" height="78" viewBox="8 8 124 124" stroke="#111" fill="#111">
      <path stroke-width="122" stroke-dasharray="2,38" d="m9,70h122M70,9v122" />
      <path stroke-width="33" stroke-linecap="round" d="m70,30h0m40,40h0m-80,40v0m40,0h0m40,0h0" />
    </svg>
  );
  const frame = (body) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect width={W} height={H} fill="#fff" />
      {glider}
      <text x={X} y="112" font-family="Silkscreen" font-weight="700" font-size="40" fill="#111">PROGRIUM</text>
      {body}
      <text x={X} y="550" font-family="Recursive" font-size="28" fill="#777" font-variation-settings="'MONO' 1">{meta}</text>
    </svg>
  );

  if (!isLog) {
    const text = page.path === "/" ? "Jeff Lindsay makes simple tools that make computers more programmable." : (page.title || siteTitle);
    const font = { family: "Recursive", size: 72, weight: 800 };
    const lines = wrap(text, font, W - 2 * X - 60).slice(0, 4);
    return frame(
      <text font-family="Recursive" font-size={font.size} font-weight={font.weight} fill="#111"
        font-variation-settings="'MONO' 0, 'CASL' 0" letter-spacing={-1.5}>
        {lines.map((line, i) => <tspan x={X} y={250 + i * 84}>{line}</tspan>)}
      </text>
    );
  }

  // Wrap to at most max lines, ending the last with … if text was cut.
  const clamp = (text, font, width, max) => {
    const lines = wrap(text, font, width);
    if (lines.length <= max) return lines;
    const out = lines.slice(0, max);
    let last = out[max - 1];
    while (last && measureText(`${last}…`, font) > width) last = last.replace(/\s*\S+$/, "");
    out[max - 1] = `${last.replace(/[\s,.;:—–-]+$/, "")}…`;
    return out;
  };

  const isLink = kind !== "log";
  const emojiSize = 52;
  const TX = page.emoji ? X + emojiSize + 24 : X; // title, domain, and snippet hang off the emoji
  const arrowW = isLink ? 44 : 0; // room after the last title line for ↗
  const title = { family: "Recursive", size: 54, weight: 600 };
  const titleLH = 66;
  const titleLines = clamp(entryTitle(page), title, W - X - TX - arrowW, 3);
  const titleTop = 214;
  const lastY = titleTop + (titleLines.length - 1) * titleLH;
  const lastW = measureText(titleLines[titleLines.length - 1], title);
  const ax = TX + lastW + 16, ay = lastY - 34; // arrow box, 30×30, sitting on the x-height

  const host = isLink ? domain(page.link) : "";
  const hostY = lastY + 50;

  // The snippet fills what's left above the glider and meta line.
  const snip = { family: "Recursive", size: 28, weight: 400 };
  const snipLH = 40;
  const snipTop = (host ? hostY : lastY) + 58;
  const snipMax = Math.max(0, Math.min(3, Math.floor((470 - snipTop) / snipLH) + 1));
  let body = page.description || stripTags(paragraphs(page.body)[0] || "");
  if (!page.title) body = body.slice(firstSentence(body).length);
  const snipLines = snipMax ? clamp(body.replace(/\s+/g, " ").trim(), snip, W - X - TX - 100, snipMax) : [];

  return frame(<>
    {page.emoji && <text x={X} y={titleTop - 2} font-family="Twemoji Mozilla" font-size={emojiSize}>{page.emoji}</text>}
    <text font-family="Recursive" font-size={title.size} font-weight={title.weight} fill="#111"
      font-variation-settings="'MONO' 0, 'CASL' 1">
      {titleLines.map((line, i) => <tspan x={TX} y={titleTop + i * titleLH}>{line}</tspan>)}
    </text>
    {isLink && <path d={`M${ax + 4},${ay + 26}L${ax + 26},${ay + 4}M${ax + 9},${ay + 4}H${ax + 26}V${ay + 21}`}
      fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />}
    {host && <text x={TX} y={hostY} font-family="Recursive" font-size="28" fill="#777"
      font-variation-settings="'MONO' 1">{host}</text>}
    {snipLines.length > 0 && <text font-family="Recursive" font-size={snip.size} font-weight={snip.weight} fill="#444"
      font-variation-settings="'MONO' 0, 'CASL' 0">
      {snipLines.map((line, i) => <tspan x={TX} y={snipTop + i * snipLH}>{line}</tspan>)}
    </text>}
  </>);
}
