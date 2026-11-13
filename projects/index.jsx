data({ title: "Projects", description: "Things I've made, am making, and helped start." });
{(() => {
  const groups = [...new Set(projects.map(p => p.group))];
  const hasPage = (p) => pages("projects").some(x => x.slug === p.slug);
  const links = (p) => [p.website && <a href={p.website}>website ↗</a>, p.source && <a href={p.source}>source ↗</a>].filter(Boolean);
  return groups.map((g, gi) => <>
    <h2 class="sec" style={gi === 0 ? { "margin-top": "0" } : null}>{g}</h2>
    <div class="proj-group">
      {projects.filter(p => p.group === g).map(p =>
        <div class="proj" id={p.slug}>
          <span class="g" aria-hidden="true">{p.g}</span>
          <div><b>{hasPage(p) ? <a class="pname" href={`/projects/${p.slug}`}>{p.name}</a> : p.name}</b>{p.years && <span class="yrs">{p.years}</span>}</div>
          <div class="d">{p.d}</div>
          {links(p).length > 0 && <div class="pl">{links(p).map((l, i) => <>{i > 0 && " · "}{l}</>)}</div>}
        </div>
      )}
    </div>
  </>);
})()}
