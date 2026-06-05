import Image from 'next/image';

import type { BlogBodyBlock } from '@/types/blog';

type BlogArticleBodyProps = {
  blocks: BlogBodyBlock[];
};

const BlogArticleBody = ({ blocks }: BlogArticleBodyProps) => {
  // Identify the index of the first paragraph so we can style it as the lede
  // (no drop-cap — they read garish on the web — but a slightly larger size).
  const firstParagraphIndex = blocks.findIndex(b => b.type === 'paragraph');

  return (
    <div className="space-y-7 text-[18px] leading-[1.8] text-stone-700">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={index}
                className={
                  index === firstParagraphIndex
                    ? 'text-[20px] leading-[1.7] text-stone-800'
                    : ''
                }
              >
                {block.text}
              </p>
            );
          case 'heading':
            return block.level === 3
              ? (
                  <h3
                    key={index}
                    className="mt-12 text-[20px] font-semibold tracking-[-0.01em] text-stone-900"
                  >
                    {block.text}
                  </h3>
                )
              : (
                  <h2
                    key={index}
                    className="mt-16 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-stone-900 md:text-[30px]"
                  >
                    {block.text}
                  </h2>
                );
          case 'list': {
            const Tag = block.ordered ? 'ol' : 'ul';
            return (
              <Tag
                key={index}
                className={`${block.ordered ? 'list-decimal' : 'list-disc'} space-y-2.5 pl-6 marker:font-semibold marker:text-stone-400`}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="pl-1">{item}</li>
                ))}
              </Tag>
            );
          }
          case 'quote':
            return (
              <blockquote
                key={index}
                className="my-12 border-l-[3px] border-primary/80 py-2 pl-8 pr-2"
              >
                <p className="text-[22px] font-medium leading-snug tracking-[-0.01em] text-stone-900">
                  &ldquo;
                  {block.text}
                  &rdquo;
                </p>
                {block.cite && (
                  <cite className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.18em] not-italic text-stone-400">
                    —
                    {' '}
                    {block.cite}
                  </cite>
                )}
              </blockquote>
            );
          case 'image':
            return (
              <figure
                key={index}
                className="my-12 overflow-hidden rounded-2xl ring-1 ring-stone-200/70"
              >
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="h-auto w-full"
                />
                {block.caption && (
                  <figcaption className="bg-stone-50 px-5 py-3 text-center text-[13px] text-stone-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case 'code':
            return (
              <pre
                key={index}
                className="my-8 overflow-x-auto rounded-2xl bg-stone-900 p-5 text-[13px] leading-relaxed text-stone-100 ring-1 ring-stone-900/10"
              >
                <code>{block.code}</code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default BlogArticleBody;
