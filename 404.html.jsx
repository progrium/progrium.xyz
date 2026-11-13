data({ title: "Not found", outputs: false });
<div class="e404">
  <div class="big404" aria-label="404">404<span class="cur" aria-hidden="true">_</span></div>
  {raw([
    '<pre class="term"><span id="lost">% cat /articles/spirit-of-plan-10',
    'cat: /articles/spirit-of-plan-10: file does not exist</span>',
    '% ls /',
    '<a href="/articles">articles/</a>  <a href="/logs">logs/</a>  <a href="/projects">projects/</a>  <a href="/about">about</a>',
    '% <span class="cur">▍</span></pre>',
  ].join("\n"))}
  <script>{`(function(){var p=location.pathname.replace(/\\/$/,"")||"/";var e=document.getElementById("lost");if(e&&p!=="/404.html")e.textContent="% cat "+p+"\\ncat: "+p+": file does not exist"})()`}</script>
</div>
