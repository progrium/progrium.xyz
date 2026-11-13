// The monthly newsletter signup, in two shapes: "home" is a single row,
// "box" has a sentence above it (end of articles, /newsletter).
(shape = "box", id = "nl-email") => {
  const fields = <>
    <span class="hp" aria-hidden="true"><input type="text" name={newsletterHoneypot} tabindex="-1" value="" /></span>
    <input id={id} name="EMAIL" type="email" autocomplete="email" required={true} placeholder="you@example.com" />
    <button type="submit">subscribe</button>
  </>;
  if (shape === "home") return (
    <form class="nl nl-home" action={newsletterAction} method="post" aria-label="Newsletter">
      <label for={id}>monthly updates</label>
      {fields}
    </form>
  );
  return (
    <form class="nl nl-box" action={newsletterAction} method="post" aria-label="Newsletter">
      <p class="nl-lead">Once a month I send a letter with a little of everything: new articles, the best of the logs, and whatever else I've been making.</p>
      <div class="nl-row"><label for={id} class="sr">Email address</label>{fields}</div>
    </form>
  );
}
