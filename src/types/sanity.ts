export type Skill = {
  icon: string;
  name: string;
  description: string;
};

export type TypeBlock = {
  _key: string;
  markDefs: any[];
  children: { _key: string; text: string; _type: string; marks: string[] }[];
  _type: string;
  style: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  cvLink: string;
  jobs: string[];
  yearsOfExperience: string;
  image: string;
  email: string;
  tel: number;
  personalDescription: TypeBlock;
  workDescription: TypeBlock;
  skills: Skill[];
};
