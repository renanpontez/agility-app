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
  metricValue1?: string;
  metricTitle1?: string;
  metricValue2?: string;
  metricTitle2?: string;
  metricValue3?: string;
  metricTitle3?: string;
  section2Title?: string;
  section2Description?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  description4?: string;
  squadMembers: string[];
};

export type ProjectProps = {
  project: Project | null;
};
