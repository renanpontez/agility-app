import Image from 'next/image';

import { ContactSection, PageHero, RevealOnScroll } from '@/components/landing-v2';
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

  const summaryItems = [
    { label: 'Cliente', value: selectedProject.clientName },
    { label: 'Tipo', value: selectedProject.type },
    { label: 'Ano', value: selectedProject.date },
    ...(selectedProject.url
      ? [{
          label: 'Website',
          value: selectedProject.url.replace(/^https?:\/\//, ''),
          href: selectedProject.url,
        }]
      : []),
  ].filter(item => item.value);

  const hasApproachContent = selectedProject.developmentDescription || selectedProject.descriptions?.length;
  const hasDetailViews = selectedProject.projectImage2 && selectedProject.projectImage3;
  const hasMetrics = selectedProject.metricAndValue && selectedProject.metricAndValue.length > 0;

  return (
    <div>
      <PageHero
        title={selectedProject.name}
        breadcrumbs={[
          { label: 'Portfolio', href: '/portfolio' },
          { label: selectedProject.name },
        ]}
      />

      {/* Opaque wrapper so content sits above the fixed hero bg */}
      <div className="relative z-10 bg-[#050505]">

        {/* 2. Summary Strip */}
        {summaryItems.length > 0 && (
          <section className="border-y border-white/[0.06] bg-white/[0.02]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {summaryItems.map((item, index) => (
                  <div
                    key={index}
                    className={`border-white/[0.06] px-5 py-6 ${index > 0 ? 'border-l' : ''} ${index >= 2 ? 'max-md:border-t' : ''} ${index === 2 ? 'max-md:border-l-0' : ''}`}
                  >
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/40">
                      {item.label}
                    </p>
                    {'href' in item && item.href
                      ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-white/80 underline decoration-white/20 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary/40"
                          >
                            {item.value}
                          </a>
                        )
                      : (
                          <p className="text-sm text-white/80">{item.value}</p>
                        )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. The Challenge */}
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
          <RevealOnScroll>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary/70">
              O Desafio
            </p>
            <h2 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
              {selectedProject.introTitle}
            </h2>
            {selectedProject.introDescription.map((text, index) => (
              <p key={index} className="mt-4 text-base leading-relaxed text-white/60">
                {text}
              </p>
            ))}
          </RevealOnScroll>
        </section>

        {/* 4. Full-Width Screenshot */}
        {selectedProject.projectImage1 && (
          <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
            <RevealOnScroll>
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40">
                <Image
                  src={selectedProject.projectImage1}
                  alt={`${selectedProject.name} — visão geral`}
                  width={1400}
                  height={900}
                  className="w-full"
                />
              </div>
            </RevealOnScroll>
          </section>
        )}

        {/* 5. Our Approach */}
        {hasApproachContent && (
          <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
            <RevealOnScroll>
              <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary/70">
                    Nossa Abordagem
                  </p>
                  {selectedProject.developmentDescription && (
                    <p className="mb-8 text-base leading-relaxed text-white/60">
                      {selectedProject.developmentDescription}
                    </p>
                  )}
                  {selectedProject.descriptions && selectedProject.descriptions.length > 0 && (
                    <ul className="space-y-4">
                      {selectedProject.descriptions.map((desc, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg className="mt-0.5 size-5 shrink-0 text-primary/60" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-white/60">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {selectedProject.projectImage4 && (
                  <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
                    <Image
                      src={selectedProject.projectImage4}
                      alt={`${selectedProject.name} — abordagem`}
                      width={600}
                      height={400}
                      className="size-full object-cover"
                    />
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </section>
        )}

        {/* 6. Detail Views */}
        {hasDetailViews && (
          <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 md:pb-28">
            <RevealOnScroll>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                <div className="pt-8">
                  <Image
                    src={selectedProject.projectImage2!}
                    alt={`${selectedProject.name} — detalhe 1`}
                    width={220}
                    height={440}
                    className="rounded-2xl border border-white/[0.06] shadow-xl shadow-black/30"
                  />
                </div>
                <div className="pb-8">
                  <Image
                    src={selectedProject.projectImage3!}
                    alt={`${selectedProject.name} — detalhe 2`}
                    width={220}
                    height={440}
                    className="rounded-2xl border border-white/[0.06] shadow-xl shadow-black/30"
                  />
                </div>
              </div>
              {selectedProject.qualityAndDeliveryDescription && (
                <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-white/50">
                  {selectedProject.qualityAndDeliveryDescription}
                </p>
              )}
            </RevealOnScroll>
          </section>
        )}

        {/* 7. Results */}
        {hasMetrics && (
          <section className="border-y border-white/[0.06] bg-white/[0.02]">
            <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-28">
              <RevealOnScroll>
                <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-primary/70">
                  Resultados
                </p>
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-3">
                  {selectedProject.metricAndValue!.map((item, index) => (
                    <div key={index} className="bg-[#0a0a0a] px-8 py-10 text-center">
                      <p className="text-4xl font-bold text-primary md:text-5xl">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-white/50">
                        {item.metric}
                      </p>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>
        )}

        {/* 8. CTA */}
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

        {/* 9. Contact */}
        <ContactSection />

      </div>
      {/* end opaque wrapper */}
    </div>
  );
};

export default PortfolioDetailPage;
