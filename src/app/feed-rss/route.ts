import { NextResponse } from 'next/server';

import { getPostsSafe } from '@/libs/blogStore';
import type { BlogBodyBlock, BlogPost } from '@/types/blog';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { localizedUrl } from '@/utils/seo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FEED_TITLE = 'Agility Creative — Blog';
const FEED_DESCRIPTION
  = 'Tecnologia, IA e ideias que importam — novidades, tutoriais e bastidores do time da Agility, em pt-BR.';

// XML escape helper — RSS bodies survive nesting so we have to be defensive.
const xmlEscape = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Convert the structured body blocks into reasonable HTML for content:encoded.
// We never trust user input here — readers like Feedly and Inoreader will
// sanitize — but we still produce conservative markup.
const renderBlockToHtml = (block: BlogBodyBlock): string => {
  switch (block.type) {
    case 'paragraph':
      return `<p>${xmlEscape(block.text)}</p>`;
    case 'heading': {
      const tag = block.level === 3 ? 'h3' : 'h2';
      return `<${tag}>${xmlEscape(block.text)}</${tag}>`;
    }
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      const items = block.items.map(i => `<li>${xmlEscape(i)}</li>`).join('');
      return `<${tag}>${items}</${tag}>`;
    }
    case 'quote': {
      const cite = block.cite ? `<cite>— ${xmlEscape(block.cite)}</cite>` : '';
      return `<blockquote><p>${xmlEscape(block.text)}</p>${cite}</blockquote>`;
    }
    case 'image': {
      const caption = block.caption
        ? `<figcaption>${xmlEscape(block.caption)}</figcaption>`
        : '';
      return `<figure><img src="${xmlEscape(block.src)}" alt="${xmlEscape(block.alt)}" />${caption}</figure>`;
    }
    case 'code': {
      const lang = block.language ? ` data-language="${xmlEscape(block.language)}"` : '';
      return `<pre${lang}><code>${xmlEscape(block.code)}</code></pre>`;
    }
    default:
      return '';
  }
};

const renderItem = (post: BlogPost): string => {
  const link = localizedUrl(AppConfig.defaultLocale, `/blog/${post.slug}`);
  const html = post.body.map(renderBlockToHtml).join('\n');
  const pubDate = new Date(post.publishedAt).toUTCString();
  const category = post.category
    ? `    <category><![CDATA[${post.category}]]></category>`
    : '';
  const enclosure = post.coverImage
    ? `    <media:content url="${xmlEscape(post.coverImage)}" medium="image" />`
    : '';
  const author = post.author?.name
    ? `    <dc:creator><![CDATA[${post.author.name}]]></dc:creator>`
    : '';
  return [
    '  <item>',
    `    <title><![CDATA[${post.title}]]></title>`,
    `    <link>${xmlEscape(link)}</link>`,
    `    <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
    `    <pubDate>${pubDate}</pubDate>`,
    `    <description><![CDATA[${post.excerpt}]]></description>`,
    `    <content:encoded><![CDATA[${html}]]></content:encoded>`,
    author,
    category,
    enclosure,
    '  </item>',
  ]
    .filter(Boolean)
    .join('\n');
};

export async function GET() {
  const posts = (await getPostsSafe())
    .filter(isPublished)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const baseUrl = getBaseUrl();
  const blogUrl = `${baseUrl}/blog`;
  const feedUrl = `${baseUrl}/feed.xml`;
  const lastBuildDate = (
    posts[0]?.publishedAt ? new Date(posts[0].publishedAt) : new Date()
  ).toUTCString();

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    // Stylesheet directive: browsers transform the feed into a styled HTML
    // landing page; feed readers ignore the line.
    '<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>',
    '<rss version="2.0"',
    '  xmlns:atom="http://www.w3.org/2005/Atom"',
    '  xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    '  xmlns:dc="http://purl.org/dc/elements/1.1/"',
    '  xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    `    <title>${xmlEscape(FEED_TITLE)}</title>`,
    `    <link>${xmlEscape(blogUrl)}</link>`,
    `    <description>${xmlEscape(FEED_DESCRIPTION)}</description>`,
    '    <language>pt-BR</language>',
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />`,
    posts.map(renderItem).join('\n'),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // 5 min at edge, 15 min at origin — feed readers poll on schedule, so
      // a short cache keeps load down without making subscribers wait.
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    },
  });
}
