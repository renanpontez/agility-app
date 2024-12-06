export type Skill = {
  icon: string;
  name: string;
  description: string;
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
  personalDescription: any[]; // 'block' type for rich text
  workDescription: any[]; // 'block' type for rich text
  skills: Skill[];
};
