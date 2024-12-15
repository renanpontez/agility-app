import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATA_SET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2022-03-07', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Needed for certain operations like updating content or accessing previewDrafts perspective
});

export async function getAllTeamMembersInfoBase() {
  const query = `
  *[_type == "teamMember"]{
    slug,
    name,
    headline,
    "userImage": userImage.asset->url,
    email,
  }
`;
  const posts = await client.fetch(query);
  return posts;
};

export async function getAllTeamMembersInfo() {
  const query = `
    *[_type == "teamMember"]
  `;
  const posts = await client.fetch(query);
  return posts;
};

export async function getTeamMemberInfo(slug: string) {
  const query = `
  *[_type == "teamMember"  && slug == $slug]{
  "id": _id,
  slug,
  name,
  resumeDownloadURL,
  headline,
  "userImage": userImage.asset->url,
  email,
  phone,
  personalDescription,
  recommendations[] {
    "userImage": userImage.asset->url,
    author,
    text,
  },
  skills[] {
    icon,
    name,
    description
  }
}
  `;
  const params = { slug };
  const posts = await client.fetch(query, params);
  return posts[0];
};
