import { client } from '../../../sanityClient';

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
    "authorImage": authorImage.asset->url,
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
