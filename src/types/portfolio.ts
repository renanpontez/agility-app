type MetricAndValue = {
  value: string;
  metric: string;
};

export type Project = {
  slug: string;
  name: string;
  logo: string;
  introTitle: string;
  introDescription: string[];
  thumbnailImage?: string;
  projectImage1?: string;
  projectImage2?: string;
  projectImage3?: string;
  projectImage4?: string;
  metricAndValue?: MetricAndValue[];
  qualityAndDeliveryDescription?: string;
  developmentDescription?: string;
  descriptions?: string[];
  squadMembers: string[];
};

export type ProjectProps = {
  project: Project | null;
};
