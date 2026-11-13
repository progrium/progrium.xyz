() => {
  const here = (href) => page.path === href || page.path.startsWith(href + "/");
  const link = (href, text) => <a href={href} aria-current={here(href) ? "page" : null}>{text}</a>;
  return (
    <nav class="nav" aria-label="Site">
      {link("/articles", "articles")}{link("/logs", "logs")}{link("/projects", "projects")}{link("/about", "about")}
    </nav>
  );
}
