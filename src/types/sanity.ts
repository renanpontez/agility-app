import type * as Icons from 'react-icons/fa';

export type Skill = {
  icon: iconPicker;
  name: string;
  description: string;
};

export type iconPicker = {
  provider: string;
  _type: string;
  name: keyof typeof Icons;
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
  image: string;
  email: string;
  tel: number;
  personalDescription: TypeBlock;
  skills: Skill[];
};
