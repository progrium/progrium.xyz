const Frontmatter = {
    Layout: "main",
}

const Component = (view, content) => (
    <main class="blog mb-8 max-w-xl">
        <div class="text-center">
            <span class="text-gray-400 text-sm font-bold">{ view.Date || "no date" }</span>
            <h1 class="mb-8">{ view.Title }</h1>
        </div>
        <div class="body mx-auto text-left text-gray-800">
            { content }
        </div>
    </main>
)