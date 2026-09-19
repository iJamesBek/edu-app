import { headingId } from "@/lib/blog-view";
import type { Block } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";

/** Renders typed blocks as semantic HTML. Text is escaped by React, so CMS content can't inject markup. */
export function PostBody({ blocks }: { blocks: Block[] }) {
  let h2 = 0;
  return (
    <div className="text-[1.075rem] leading-[1.8] text-chalk/85">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2": {
            const id = headingId(block.text, h2++);
            return (
              <Reveal key={i} y={16}>
                <h2 id={id} className="mt-14 scroll-mt-28 font-display text-2xl font-bold leading-snug text-chalk sm:text-3xl">
                  {block.text}
                </h2>
              </Reveal>
            );
          }
          case "p":
            return (
              <p key={i} className="mt-5">
                {block.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="mt-5 space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="relative pl-7">
                    <span aria-hidden className="absolute left-0 top-[0.7em] size-2 rounded-full bg-majolica" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <Reveal key={i} y={16}>
                <figure className="my-10 border-l-4 border-amber pl-6">
                  <blockquote className="font-display text-2xl font-medium leading-snug text-chalk">“{block.text}”</blockquote>
                  {block.cite && <figcaption className="mt-3 text-sm text-chalk/55">{block.cite}</figcaption>}
                </figure>
              </Reveal>
            );
        }
      })}
    </div>
  );
}
