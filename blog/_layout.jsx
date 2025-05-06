(content) => 
    <main class="blog mb-8 max-w-xl">
        <div class="text-center">
            <span class="text-gray-400 text-sm font-bold">{ page.date || "no date" }</span>
            <h1 class="mb-8">{ page.title || "no title" }</h1>
        </div>
        <div class="body mx-auto text-left text-gray-800">
            { content }
        </div>
        { page.comment_url && (
            <div class="mt-8 underline">
                <a href={ page.comment_url }>
                    Comment on this post
                </a>
            </div>
        )}
    </main>
