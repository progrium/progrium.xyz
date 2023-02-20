import {v,view} from "tinygen";
export default view({}, ({title, site, dev}, children) => (
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="/vnd/tailwind-3.2.4.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/speed-highlight/core/dist/themes/default.css"></link>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap" rel="stylesheet" type="text/css"></link>
    <link href="/style.css" rel="stylesheet"></link>
    <title>{title?`${title} - ${site}`:site}</title>
  </head>
  <body class="bg-black">

  <header class="bg-white py-12">
    <nav class="mx-auto max-w-2xl">
      <div class="flex w-full items-center justify-between">
        <div class="flex items-end">
          <a href="/" class="text-xl font-black decoration-solid">
            progrium.xyz
          </a>
          <div class="space-x-8 ml-10" style={{paddingBottom: "1px"}}>
            <a href="/blog" class="text-base decoration-solid font-normal hover:text-gray-500">Blog</a>
            {/* <a href="/talks" class="text-base decoration-solid font-normal hover:text-gray-500">Talks</a> */}
            {/* <a href="/about" class="text-base decoration-solid font-normal hover:text-gray-400">About</a> */}
            <a href="https://progrium.com" target="_blank" class="text-base decoration-solid font-normal hover:text-gray-500">
              Work
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="inline ml-1" style={{marginBottom: "3px"}} viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="space-x-4 flex">
          <a href="https://twitter.com/progrium" class="hover:text-gray-500">
            <span class="sr-only">Twitter</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>

          <a href="https://github.com/progrium" class="hover:text-gray-500">
            <span class="sr-only">GitHub</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>

          <a href="https://www.youtube.com/c/progrium" class="hover:text-gray-500" style="margin-top: 2px;">
            <span class="sr-only">YouTube</span>
            <svg class="h-5 w-5" fill="currentColor"  viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
          </a>

          <a href="https://www.twitch.tv/progrium" class="hover:text-gray-500" style="margin-top: 3px;">
            <span class="sr-only">Twitch</span>
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 512 512"><path d="M391.17,103.47H352.54v109.7h38.63ZM285,103H246.37V212.75H285ZM120.83,0,24.31,91.42V420.58H140.14V512l96.53-91.42h77.25L487.69,256V0ZM449.07,237.75l-77.22,73.12H294.61l-67.6,64v-64H140.14V36.58H449.07Z"/></svg>
          </a>
          
          
        </div>
      </div>
    </nav>
  </header>

  <section class="bg-white flex flex-col justify-center pb-16" style={{minHeight: "50vh"}}>
    <div class="mx-auto max-w-2xl">
      {children}
    </div>
  </section>

  <footer class="bg-black py-16">
    <div class="mx-auto max-w-2xl">
      <div class="xl:grid xl:grid-cols-4 xl:gap-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewbox="0 0 140 140" stroke="white">
          <path stroke-width="122" stroke-dasharray="2,38" d="m9,70h122M70,9v122"/>
          <path stroke-width="33" stroke-linecap="round" d="m70,30h0m40,40h0m-80,40v0m40,0h0m40,0h0"/>
        </svg>
        <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold leading-6 text-white">progrium.xyz</h3>
              <ul role="list" class="mt-2">
                <li>
                  <a href="/" class="text-sm leading-6 text-gray-300 hover:text-white">Home</a>
                </li>

                <li>
                  <a href="/blog" class="text-sm leading-6 text-gray-300 hover:text-white">Blog</a>
                </li>

                {/* <li>
                  <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white">Talks</a>
                </li> */}

                {/* <li>
                  <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white">About</a>
                </li> */}

                <li>
                  <a href="https://progrium.com" class="text-sm leading-6 text-gray-300 hover:text-white">Work</a>
                </li>
              </ul>
            </div>
            <div class="mt-10 md:mt-0">
              <h3 class="text-sm font-semibold leading-6 text-white">Follow</h3>
              <ul role="list" class="mt-2">
                <li>
                  <a href="https://twitter.com/progrium" class="text-sm leading-6 text-gray-300 hover:text-white">Twitter</a>
                </li>

                <li>
                  <a href="https://github.com/progrium" class="text-sm leading-6 text-gray-300 hover:text-white">GitHub</a>
                </li>

                {/* <li>
                  <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white">Mastodon</a>
                </li> */}

              </ul>
            </div>
          </div>
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold leading-6 text-white">Content</h3>
              <ul role="list" class="mt-2">
                <li>
                  <a href="https://www.youtube.com/c/progrium" class="text-sm leading-6 text-gray-300 hover:text-white">YouTube</a>
                </li>

                <li>
                  <a href="https://www.twitch.tv/progrium" class="text-sm leading-6 text-gray-300 hover:text-white">Twitch</a>
                </li>

                <li>
                  <a href="https://soundcloud.com/progrium" class="text-sm leading-6 text-gray-300 hover:text-white">Soundcloud</a>
                </li>

                <li>
                  <a href="https://progrium.itch.io/" class="text-sm leading-6 text-gray-300 hover:text-white">itch.io</a>
                </li>

              </ul>
            </div>
            <div class="mt-10 md:mt-0">
              <h3 class="text-sm font-semibold leading-6 text-white">Contact</h3>
              <ul role="list" class="mt-2">
                <li>
                  <a href="mailto:progrium+web@gmail.com" class="text-sm leading-6 text-gray-300 hover:text-white">Email</a>
                </li>

                <li>
                  <a href="https://discord.gg/JraBdNHuuP" class="text-sm leading-6 text-gray-300 hover:text-white">Discord</a>
                </li>

                <li>
                  <a href="https://www.linkedin.com/in/progrium/" class="text-sm leading-6 text-gray-300 hover:text-white">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>

  {(dev)?<script src="https://deno.land/x/refresh/client.js"></script>:null}
  </body>
</html>
));
{/* <div class="-ml-12 h-20 w-20 brightness-125 grayscale hover:grayscale-0 rounded-full hidden lg:block" 
              title="Jeff Lindsay"
              style={{
                background: "url(/photo.jpeg)",
                backgroundSize: "115%",
                backgroundPosition: "-5px -6px"
              }}>
              
            </div> */}