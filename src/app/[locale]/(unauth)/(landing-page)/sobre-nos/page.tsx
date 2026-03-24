import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import {
  PageHero,
  RevealOnScroll,
} from '@/components/landing-v2';

const TeamGrid = dynamic(() => import('@/components/landing-v2/TeamGrid'));
const ServicesGrid = dynamic(() => import('@/components/landing-v2/ServicesGrid'));
const ContactSection = dynamic(() => import('@/components/landing-v2/ContactSection'));

/* ───────────────────────────── PAGE ───────────────────────────── */

const AboutUsPage = async () => {
  const t = await getTranslations('AboutPage');

  const PROCESS_STEPS = [
    { step: '01', title: t('step1_title'), description: t('step1_description') },
    { step: '02', title: t('step2_title'), description: t('step2_description') },
    { step: '03', title: t('step3_title'), description: t('step3_description') },
    { step: '04', title: t('step4_title'), description: t('step4_description') },
    { step: '05', title: t('step5_title'), description: t('step5_description') },
  ];

  return (
    <>
      {/* ─── HERO ─── */}
      <PageHero
        badge={t('badge')}
        title={(
          <>
            {t('title')}
            {' '}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </>
        )}
        subtitle={t('subtitle')}
      />

      {/* Opaque wrapper so content sits above the fixed hero bg */}
      <div className="relative z-10 bg-[#050505]">

        {/* ─── TESTIMONIAL ─── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <RevealOnScroll>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm sm:p-12">
                <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
                  {t('testimonialBadge')}
                </span>
                <blockquote className="relative">
                  <span className="absolute -left-2 -top-4 font-serif text-6xl text-primary/30">&ldquo;</span>
                  <p className="relative z-10 text-lg leading-relaxed text-white/70">
                    {t('testimonialQuote')}
                  </p>
                  <footer className="mt-6 text-sm text-white/40">
                    <strong className="text-white/60">{t('testimonialAuthor')}</strong>
                    {' '}
                    —
                    {' '}
                    {t('testimonialCompany')}
                  </footer>
                </blockquote>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── HOW WE WORK ─── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
            <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
              <RevealOnScroll className="flex-1">
                <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
                  {t('processBadge')}
                </span>
                <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                  {t('processTitle')}
                  {' '}
                  <span className="text-primary">{t('processTitleHighlight')}</span>
                </h2>
                <p className="text-lg leading-relaxed text-white/60">
                  {t('processP1')}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-white/60">
                  {t('processP2')}
                </p>
              </RevealOnScroll>

              <div className="flex flex-1 flex-col gap-4">
                {PROCESS_STEPS.map((item, i) => (
                  <RevealOnScroll key={item.step} delay={i * 80}>
                    <div className="group flex gap-5 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.05]">
                      <span className="text-2xl font-bold text-primary/40">{item.step}</span>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm text-white/50">{item.description}</p>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── TEAM ─── */}
        <TeamGrid />

        {/* ─── SERVICES ─── */}
        <ServicesGrid />

        {/* ─── PARALLAX CTA ─── */}
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
              <div className="max-w-xl">
                <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
                  {t('ctaTitle')}
                  {' '}
                  <span className="text-primary">{t('ctaHighlight')}</span>
                </h2>
                <p className="mb-8 text-lg text-white/60">
                  {t('ctaDescription')}
                </p>
                <a
                  href="#Contato"
                  className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                >
                  {t('ctaButton')}
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <ContactSection />

      </div>
      {/* end opaque wrapper */}
    </>
  );
};

export default AboutUsPage;
