import type * as Icons from 'react-icons/fa';

export type ISkill = {
  icon: IiconPicker;
  name: string;
  description: string;
};

export type IRecommendations = {
  image: string;
  text: string;
  author: string;
};

export type IiconPicker = {
  provider: string;
  _type: string;
  name: keyof typeof Icons;
};

export type ITypeBlock = {
  _key: string;
  markDefs: any[];
  children: { _key: string; text: string; _type: string; marks: string[] }[];
  _type: string;
  style: string;
};

export type ITeamMember = {
  slug: string;
  name: string;
  cvLink: string;
  jobs: string[];
  image: string;
  email: string;
  tel: number;
  recommendations: IRecommendations[];
  personalDescription: ITypeBlock;
  skills: ISkill[];
};
