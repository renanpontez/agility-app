type metricAndValue = {
  value: string;
  metric: string;
};

export type Project = {
  slug: string;
  name: string;
  logo: string;
  introTitle: string;
  introDescription: string[];
  projectImage1?: string;
  projectImage2?: string;
  projectImage3?: string;
  projectImage4?: string;
  metricAndValue?: metricAndValue[];
  qualityAndDeliveryDescription?: string;
  developmentDescription?: string;
  descriptions?: string[];
  squadMembers: string[];
};

export type ProjectProps = {
  project: Project | null;
};
