export type BlogAuthor = {
  name: string;
  avatar?: string;
  role?: string;
};

export type BlogBodyBlock
  = | { type: 'paragraph'; text: string }
    | { type: 'heading'; level: 2 | 3; text: string }
    | { type: 'list'; ordered?: boolean; items: string[] }
    | { type: 'quote'; text: string; cite?: string }
    | { type: 'image'; src: string; alt: string; caption?: string }
    | { type: 'code'; language?: string; code: string };

// Drafts are invisible to public surfaces (listing, detail page, sitemap,
// generateStaticParams). A missing status means "published" — legacy posts
// from before this field was introduced are grandfathered.
export type BlogStatus = 'draft' | 'published';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  coverAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  category?: string;
  tags?: string[];
  author?: BlogAuthor;
  status?: BlogStatus;
  body: BlogBodyBlock[];
};

export const isPublished = (post: Pick<BlogPost, 'status'>): boolean =>
  post.status !== 'draft';
