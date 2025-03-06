data({
  layout: "_layout",
  title: "Blog",
});
<main class="mb-8 mx-auto max-w-xl">
  {pages("blog").filter(page => page.isDir && Number(page.slug) >= 2025).reverse().map(year => (
    <div>
      <h3>{ year.slug }</h3>
      <ul class="mb-8">
      {year.subpages.reverse().map(post => (
        <li class="flex space-x-2 my-2">
          <span class="text-gray-400 w-24">{post.date}</span>
          <a class="underline" href={post.path}>{post.title}</a>
        </li>
      ))}
      </ul>
    </div>
  ))}

  <a class="underline" href="/blog/archive">Archive</a>
</main>