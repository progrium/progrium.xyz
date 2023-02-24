import {v,view} from "tinygen";
import layout from "../_layout.tsx";
export default view({layout}, ({title, date}, children) => (
  <main class="blog mb-8 max-w-xl">
    <div class="text-center">
      <span class="text-gray-400 text-sm font-bold">{date||""}</span>
      <h1 class="mb-8">{title}</h1>
    </div>
    <div class="body mx-auto text-left text-gray-800">
      {children}
    </div>
    
  </main>
));
