import Breadcrumb from '@/components/BreadCrumb';
import type { BreadcrumbItemsProps } from '@/components/BreadCrumb/BreadCrumb';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Text from '@/components/Text';
import portfolioData from '@/data/portfolio.json';
import type { Project } from '@/types/portfolio';

export async function generateStaticParams() {
  return portfolioData as Array<Project>;
}

const PortfolioPage: React.FC = () => {
  const breadcrumbItems: BreadcrumbItemsProps[] = [
    { name: 'Portfolio' },
  ];

  return (
    <>
      <section>
        <Hero
          mediaType="image"
          mediaSrc="/assets/images/agility-team-working.jpeg"
          style="custom-height"
          applyMask
          content={(
            <Text as="h1" className="font-light leading-normal tracking-wide text-white">
              Portfolio Agility
            </Text>
          )}
          className="min-h-[300px] md:min-h-[60vh]"
        />
      </section>
      <Breadcrumb items={breadcrumbItems} />

      <section className="mx-auto max-w-[90%] py-16 text-center md:max-w-[70%] md:py-24" id="Portfolio">
        <Portfolio items={portfolioData} />
      </section>
    </>
  );
};

export default PortfolioPage;
