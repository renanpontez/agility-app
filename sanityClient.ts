import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '0bz33x6i',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2022-03-07', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Needed for certain operations like updating content or accessing previewDrafts perspective
});

export async function getAllTeamMembersInfoBase() {
  const query = `
  *[_type == "teamMember"]{
    slug,
    name,
    jobs,
    image {
      asset->url
    },
    email,
  }
`;
  const posts = await client.fetch(query);
  return posts;
};

export async function getAllTeamMembersInfo() {
  const query = `
    *[_type == "teamMember"]{
      slug,
      name,
      cvLink,
      jobs,
      yearsOfExperience,
      image: image.asset->url,
      email,
      tel,
      personalDescription,
      workDescription,
      skills[]{
        icon: icon.asset->url,
        name,
        description
      }
    }
  `;
  const posts = await client.fetch(query);
  return posts;
};

export async function getTeamMemberInfo(slug: string) {
  const query = `
    *[_type == "teamMember" && slug == $slug]{
      slug,
      name,
      cvLink,
      jobs,
      yearsOfExperience,
      image: image.asset->url,
      email,
      tel,
      personalDescription,
      workDescription,
      skills[]{
        icon: icon.asset->url,
        name,
        description
      }
    }
  `;
  const params = { slug };
  const posts = await client.fetch(query, params);
  return posts[0];
};
