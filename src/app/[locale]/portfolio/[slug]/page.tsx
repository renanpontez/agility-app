import Image from 'next/image';

import { ContactSection, RevealOnScroll } from '@/components/landing-v2';
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

const PortfolioDetailPage = async ({ params }: { params: Params }) => {
  const selectedProject = portfolioData.find((item: Project) => item.slug === params.slug);

  if (!selectedProject) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-28">
        <p className="text-lg text-white/50">Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="pt-28">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/agility-team-working.jpeg"
            alt={selectedProject.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <RevealOnScroll>
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
              <a href="/portfolio" className="transition-colors hover:text-white">Portfolio</a>
              <span>/</span>
              <span className="text-white/70">{selectedProject.name}</span>
            </nav>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {selectedProject.name}
            </h1>
          </RevealOnScroll>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        {/* Introduction */}
        <RevealOnScroll>
          <section className="flex flex-col gap-8 md:grid md:grid-cols-11">
            <h2 className="col-span-5 text-xs font-semibold uppercase tracking-widest text-primary/70">
              Introdução
            </h2>
            <div className="col-span-6">
              <h3 className="mb-5 text-3xl font-medium leading-snug">
                {selectedProject.introTitle}
              </h3>
              {selectedProject.introDescription.map((text, index) => (
                <p key={index} className="mt-3 text-base leading-relaxed tracking-wider text-white/60">
                  {text}
                </p>
              ))}
            </div>
          </section>
        </RevealOnScroll>

        <div className="mx-auto my-20 h-px w-[70vw] max-w-2xl rounded-full bg-white/10" />

        {/* Project delivered */}
        <RevealOnScroll>
          <section className="flex flex-col gap-8 md:grid md:grid-cols-11">
            <h2 className="col-span-5 text-xs font-semibold uppercase tracking-widest text-primary/70">
              Projeto entregue
            </h2>
            <div className="col-span-6 overflow-hidden rounded-2xl border border-white/[0.06]">
              <Image src={selectedProject.projectImage1} alt="Projeto" width={701} height={1590} className="w-full" />
            </div>
          </section>
        </RevealOnScroll>

        <div className="mx-auto my-20 h-px w-[70vw] max-w-2xl rounded-full bg-white/10" />

        {/* Development */}
        <RevealOnScroll>
          <section className="relative flex flex-col flex-wrap gap-8 lg:grid lg:grid-cols-11">
            {(selectedProject.projectImage2 && selectedProject.projectImage3) && (
              <div className="col-span-5 flex flex-wrap justify-center gap-10 md:flex-nowrap lg:justify-start">
                <Image src={selectedProject.projectImage2} alt="Mobile view" width={178} height={400} className="rounded-2xl border border-white/[0.06] lg:pt-10" />
                <Image src={selectedProject.projectImage3} alt="Mobile view" width={178} height={400} className="rounded-2xl border border-white/[0.06] lg:pb-10" />
              </div>
            )}
            {selectedProject.developmentDescription && (
              <div className="col-span-6">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/70">
                  Desenvolvimento
                </h2>
                <p className="tracking-wider text-white/60">{selectedProject.developmentDescription}</p>
                <div className="mt-6 flex flex-wrap justify-around gap-x-3 gap-y-4 text-center sm:mt-14 md:justify-between">
                  {selectedProject.metricAndValue.map((item, index) => (
                    <div key={index}>
                      <p className="text-5xl font-bold text-primary">
                        {item.value}
                      </p>
                      <p className="pt-1 text-sm text-white/60">
                        {item.metric.toUpperCase()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </RevealOnScroll>

        <div className="mx-auto my-20 h-px w-[70vw] max-w-2xl rounded-full bg-white/10" />

        {/* Quality */}
        <RevealOnScroll>
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary/70">
              Qualidade e entrega
            </h2>
            <p className="mb-8 text-base leading-relaxed text-white/60 lg:max-w-[44%]">
              {selectedProject.qualityAndDeliveryDescription}
            </p>
            <div className="relative flex grid-cols-2 flex-col gap-8 tracking-wider md:grid">
              <div className="flex flex-col items-start justify-between gap-4">
                {selectedProject.descriptions.map((description, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <svg className="mt-0.5 size-5 shrink-0 text-primary/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm tracking-wide text-white/60">{description}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
                <Image src={selectedProject.projectImage4} alt="Quality" width={600} height={312} className="w-full" />
              </div>
            </div>
          </section>
        </RevealOnScroll>
      </div>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/agility-team-working.jpeg"
            alt="Agility team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
          <RevealOnScroll>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                Mentes
                {' '}
                <span className="text-primary">criativas</span>
                {' '}
                e processos
                {' '}
                <span className="text-primary">organizados</span>
                {' '}
                geram mais resultados
              </h2>
              <a
                href="#Contato"
                className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                CONHEÇA A AGILITY
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />
    </div>
  );
};

export default PortfolioDetailPage;
