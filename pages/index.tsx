import {m} from "../deps.ts";
import layout from "../layouts/global.tsx";

const Page: m.Component = {
  view ({attrs}) {
    return m(layout, {site: attrs.site, page: {title: "Index"}},
      <div>Hello world</div>
    );
  }
};

export default Page;