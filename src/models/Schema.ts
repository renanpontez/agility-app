import { index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import type { BlogPost } from '@/types/blog';

export const guestbookSchema = pgTable('guestbook', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  body: text('body').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Posts do blog em uma única linha (id = 1) com o array inteiro em JSONB.
// A API é single-writer, então não precisamos de uma tabela normalizada.
export const blogStoreSchema = pgTable('blog_store', {
  id: integer('id').primaryKey().default(1),
  data: jsonb('data').$type<BlogPost[]>().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Email subscribers for the blog. Double opt-in: rows start as 'pending',
// move to 'confirmed' when the user clicks the confirmation link, and to
// 'unsubscribed' when they opt out. We never delete rows — keeping the
// history matters for LGPD / CAN-SPAM audits ("when did this address last
// consent?") and for preventing accidental re-sends after an unsubscribe.
export const blogSubscribersSchema = pgTable(
  'blog_subscribers',
  {
    id: serial('id').primaryKey(),
    // Normalized to lowercase by the application before insertion.
    email: varchar('email', { length: 320 }).notNull(),
    // 'pending' | 'confirmed' | 'unsubscribed'
    status: varchar('status', { length: 16 }).notNull().default('pending'),
    // 64 hex chars = 32 random bytes — used in the confirm/unsubscribe URLs.
    confirmToken: varchar('confirm_token', { length: 64 }).notNull(),
    unsubscribeToken: varchar('unsubscribe_token', { length: 64 }).notNull(),
    locale: varchar('locale', { length: 8 }).notNull().default('pt-BR'),
    // Source page or campaign — useful later for attribution. Free-form.
    source: varchar('source', { length: 64 }),
    confirmedAt: timestamp('confirmed_at', { mode: 'date' }),
    unsubscribedAt: timestamp('unsubscribed_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => ({
    emailIdx: uniqueIndex('blog_subscribers_email_idx').on(table.email),
    confirmTokenIdx: uniqueIndex('blog_subscribers_confirm_token_idx').on(table.confirmToken),
    unsubscribeTokenIdx: uniqueIndex('blog_subscribers_unsubscribe_token_idx').on(
      table.unsubscribeToken,
    ),
    statusIdx: index('blog_subscribers_status_idx').on(table.status),
  }),
);

export type BlogSubscriber = typeof blogSubscribersSchema.$inferSelect;
