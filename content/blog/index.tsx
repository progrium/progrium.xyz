import {v,view,pages} from "tinygen";
import {groupByYear, byDate} from "../../site.ts";
export default view({}, () => (
  <main class="mb-8 mx-auto max-w-xl">
    {groupByYear(pages("blog")).map(([year, pages]) =>
    <div>
      <h2 class="text-xl font-light">{year}</h2>
      <ul class="mb-8">
        {pages.sort(byDate).map(p => 
          <li class="flex space-x-2 my-2">
            <span class="text-gray-400 w-24">{p.date}</span>
            <a class="underline" href={p.path}>{p.title}</a>
          </li>
        )}
      </ul>
    </div>
    )}    
  </main>
));
