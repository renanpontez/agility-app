import { describe, expect, it } from 'vitest';

import {
  findCategoryBySlug,
  getAllCategorySlugs,
  getOrderedCategories,
  slugifyCategory,
} from './categories';

describe('slugifyCategory', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugifyCategory('Inteligência Artificial')).toBe('inteligencia-artificial');
    expect(slugifyCategory('Web Development')).toBe('web-development');
  });

  it('strips diacritics', () => {
    expect(slugifyCategory('Gestão')).toBe('gestao');
    expect(slugifyCategory('São Paulo')).toBe('sao-paulo');
  });

  it('collapses consecutive separators and trims edges', () => {
    expect(slugifyCategory('  Foo --  Bar  ')).toBe('foo-bar');
    expect(slugifyCategory('!!!Tech!!!')).toBe('tech');
  });

  it('returns empty string for non-alphanumeric input', () => {
    expect(slugifyCategory('!!!')).toBe('');
    expect(slugifyCategory('   ')).toBe('');
  });
});

describe('getOrderedCategories', () => {
  it('preserves first-seen order and dedupes by slug', () => {
    const posts = [
      { category: 'Produto' },
      { category: 'Design' },
      { category: 'Produto' },
      { category: 'Inteligência Artificial' },
    ];
    expect(getOrderedCategories(posts)).toEqual([
      { slug: 'produto', label: 'Produto' },
      { slug: 'design', label: 'Design' },
      { slug: 'inteligencia-artificial', label: 'Inteligência Artificial' },
    ]);
  });

  it('skips posts without a category', () => {
    const posts = [
      { category: undefined },
      { category: 'Produto' },
      { category: undefined },
    ];
    expect(getOrderedCategories(posts)).toEqual([
      { slug: 'produto', label: 'Produto' },
    ]);
  });

  it('keeps the label of the first post that introduced the category', () => {
    // Same slug, different casing — the first label wins.
    const posts = [{ category: 'IA' }, { category: 'ia' }];
    expect(getOrderedCategories(posts)).toEqual([{ slug: 'ia', label: 'IA' }]);
  });
});

describe('findCategoryBySlug', () => {
  it('returns the matching category', () => {
    const posts = [{ category: 'Produto' }, { category: 'Design' }];
    expect(findCategoryBySlug(posts, 'design')).toEqual({ slug: 'design', label: 'Design' });
  });

  it('returns undefined for unknown slugs', () => {
    expect(findCategoryBySlug([{ category: 'Produto' }], 'design')).toBeUndefined();
  });
});

describe('getAllCategorySlugs', () => {
  it('returns slugs in first-seen order', () => {
    const posts = [
      { category: 'Produto' },
      { category: 'Inteligência Artificial' },
      { category: 'Design' },
    ];
    expect(getAllCategorySlugs(posts)).toEqual([
      'produto',
      'inteligencia-artificial',
      'design',
    ]);
  });
});
