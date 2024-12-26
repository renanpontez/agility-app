export type Skill = {
  icon: IconPicker;
  name: string;
  description: string;
};

export type Recommendations = {
  authorImage: string;
  text: string;
  author: string;
};

export type IconPicker = {
  provider: string;
  _type: string;
  svg: string;
  name: string;
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
  resumeDownloadURL: string;
  headline: string[];
  userImage: string;
  email: string;
  phone: number;
  recommendations: Recommendations[];
  personalDescription: TypeBlock;
  skills: Skill[];
};
