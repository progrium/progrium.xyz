params(() => pages("logs/**").filter(isEntry).map(p => ({ year: p.date.slice(0, 4) })));
data({ title: `Logs from ${page.params.year}` });
{partial("_partials/journal", entries(pages({ path: ["logs/**"] })).filter(p => p.date.startsWith(page.params.year)))}
