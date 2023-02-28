import {v,view} from "tinygen";
export default view({
  description: "Personal homepage for Jeff Lindsay",
  cover_image: "https://progrium.xyz/photo2.jpeg"
}, () => (
  <div>
    <div class="flex gap-8">
      <div>
        <p class="my-4 text-3xl">Hello, I'm Jeff!</p>
        <p class="my-4">
        I'm a creator and entrepreneur known for my work and ideas in open source developer tooling.
        </p>
        <p class="my-4">
        I try to push the boundaries of computing as a magical tool and compiler for the imagination.
        </p>
        <p class="my-4">
        Otherwise I enjoy making indie games and producing music. Someday I'd like to make films.
        </p>
      </div>
      <div class="shrink-0 py-1">
        <img class="w-64 grayscale hover:grayscale-0 rounded-xl" src="./photo2.jpeg" />
      </div>
    </div>
  </div>
));