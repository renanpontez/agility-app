import Image from 'next/image';

import type { BlogBodyBlock } from '@/types/blog';

type BlogArticleBodyProps = {
  blocks: BlogBodyBlock[];
};

const BlogArticleBody = ({ blocks }: BlogArticleBodyProps) => {
  return (
    <div className="space-y-6 text-[17px] leading-[1.75] text-neutral-700">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={index}>{block.text}</p>;
          case 'heading':
            return block.level === 3
              ? (
                  <h3 key={index} className="mt-10 text-xl font-semibold text-neutral-900">
                    {block.text}
                  </h3>
                )
              : (
                  <h2 key={index} className="mt-12 text-2xl font-semibold text-neutral-900 md:text-[1.75rem]">
                    {block.text}
                  </h2>
                );
          case 'list': {
            const Tag = block.ordered ? 'ol' : 'ul';
            return (
              <Tag
                key={index}
                className={`${block.ordered ? 'list-decimal' : 'list-disc'} space-y-2 pl-6 marker:text-primary`}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </Tag>
            );
          }
          case 'quote':
            return (
              <blockquote
                key={index}
                className="my-10 border-l-2 border-primary py-2 pl-6 text-xl font-medium leading-snug text-neutral-900"
              >
                <p>
                  &ldquo;
                  {block.text}
                  &rdquo;
                </p>
                {block.cite && (
                  <cite className="mt-3 block text-sm not-italic text-neutral-500">
                    —
                    {' '}
                    {block.cite}
                  </cite>
                )}
              </blockquote>
            );
          case 'image':
            return (
              <figure key={index} className="my-10 overflow-hidden rounded-xl border border-neutral-200">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="h-auto w-full"
                />
                {block.caption && (
                  <figcaption className="bg-neutral-50 px-4 py-3 text-center text-sm text-neutral-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case 'code':
            return (
              <pre
                key={index}
                className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800"
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
