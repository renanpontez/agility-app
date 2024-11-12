import portfolioData from '@/data/portfolio.json';
import type { Project } from '@/types/portfolio';

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  return portfolioData.map((item: Project) => ({
    slug: item.slug,
  }));
}

const PortfolioPage = async ({ params }: { params: Params }) => {
  const selectedProject = portfolioData.find((item: Project) => item.slug === params.slug);

  if (!selectedProject) {
    return <p>Projeto não encontrado</p>;
  }

  return (
    <div>
      <h1>{selectedProject.name}</h1>
      <p>{selectedProject.introTitle}</p>
      {/* Renderize outros dados conforme necessário */}
    </div>
  );
};

export default PortfolioPage;
