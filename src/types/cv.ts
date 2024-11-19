export type Skill = {
  icon: string;
  name: string;
  description: string;
};

export type PortfolioItem = {
  image: string;
  name: string;
  description: string;
};

export type Recommendation = {
  image: string;
  text: string;
  author: string;
};

export type UserProfile = {
  slug: string;
  name: string;
  yearsOfExperience: string;
  image: string;
  email: string;
  tel: string;
  personalDescription: string;
  workDescription: string;
  skills: Skill[];
  portfolio: PortfolioItem[];
  recommendations: Recommendation[];
};
