data({ title: "Projects", description: "Things I've made, am making, and helped start." });
{(() => {
  const all = projectList(pages("projects"));
  const links = (p) => [p.website && <a href={p.website}>website ↗</a>, p.source && <a href={p.source}>source ↗</a>].filter(Boolean);
  return projectGroups.map((g, gi) => <>
    <h2 class="sec" style={gi === 0 ? { "margin-top": "0" } : null}>{g}</h2>
    <div class="proj-group">
      {all.filter(p => p.group === g).map(p =>
        <div class="proj" id={p.slug}>
          <span class="g" aria-hidden="true">{p.emoji}</span>
          <div><b>{hasStory(p) ? <a class="pname" href={p.path}>{p.title}</a> : p.title}</b>{p.years && <span class="yrs">{p.years}</span>}</div>
          <div class="d">{p.description}</div>
          {links(p).length > 0 && <div class="pl">{links(p).map((l, i) => <>{i > 0 && " · "}{l}</>)}</div>}
        </div>
      )}
    </div>
  </>);
})()}
