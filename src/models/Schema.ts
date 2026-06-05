import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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
