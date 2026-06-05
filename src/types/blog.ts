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
  body: BlogBodyBlock[];
};
