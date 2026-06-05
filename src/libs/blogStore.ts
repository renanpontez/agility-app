import { eq } from 'drizzle-orm';

import seedData from '@/data/blog.json';
import { db } from '@/libs/DB';
import { blogStoreSchema } from '@/models/Schema';
import type { BlogPost } from '@/types/blog';

/**
 * Armazenamento dos posts do blog.
 *
 * Antes os posts viviam em src/data/blog.json e a API escrevia nesse arquivo —
 * o que falha em runtime serverless (filesystem read-only → storage_write_failed).
 * Agora a fonte de verdade é o Postgres (via Drizzle, ver src/libs/DB): uma única
 * linha JSONB (id = 1) com o array inteiro de posts. A API é single-writer.
 *
 * O blog.json continua existindo como SEED: na primeira leitura, se a tabela
 * estiver vazia, ela é populada com o snapshot do build. Também serve de fallback
 * de leitura quando o banco está indisponível (ver getPostsSafe).
 */

const SINGLETON_ID = 1;

const seedPosts = (): BlogPost[] => seedData as BlogPost[];

/**
 * Leitura estrita: lança em caso de falha do banco. Use na API (POST /api/blog),
 * onde uma falha de leitura deve virar 500 storage_read_failed.
 */
export const getPosts = async (): Promise<BlogPost[]> => {
  const rows = await db
    .select({ data: blogStoreSchema.data })
    .from(blogStoreSchema)
    .where(eq(blogStoreSchema.id, SINGLETON_ID))
    .limit(1);

  if (rows.length > 0) {
    return rows[0]!.data;
  }

  // Tabela vazia: semeia uma vez com o snapshot do build.
  const seed = seedPosts();
  await db
    .insert(blogStoreSchema)
    .values({ id: SINGLETON_ID, data: seed })
    .onConflictDoNothing();
  return seed;
};

/**
 * Leitura tolerante: nunca lança — em falha, devolve o snapshot do build.
 * Use nas páginas/sitemap, para o site não cair se o banco estiver fora do ar.
 */
export const getPostsSafe = async (): Promise<BlogPost[]> => {
  try {
    return await getPosts();
  } catch (err) {
    console.error('[blogStore] leitura falhou, usando snapshot do build:', err);
    return seedPosts();
  }
};

/**
 * Persiste o array inteiro de posts (upsert na linha singleton). Lança em caso de
 * falha (a API converte para 500 storage_write_failed).
 */
export const savePosts = async (posts: BlogPost[]): Promise<void> => {
  await db
    .insert(blogStoreSchema)
    .values({ id: SINGLETON_ID, data: posts })
    .onConflictDoUpdate({
      target: blogStoreSchema.id,
      set: { data: posts },
    });
};
