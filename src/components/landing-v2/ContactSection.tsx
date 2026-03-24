'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { IoLogoInstagram, IoMailOutline } from 'react-icons/io5';

import RevealOnScroll from './RevealOnScroll';

const ContactSection = () => {
  const t = useTranslations('ContactSection');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const goToWhatsapp = () => {
    const msg = t('whatsappMessage', { name: formData.name, email: formData.email, message: formData.message });
    window.open(`https://wa.me/+5585996284730?text=${encodeURIComponent(msg)}`);
  };

  return (
    <section id="Contato" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          <RevealOnScroll className="flex-1">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
              {t('badge')}
            </span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              {t('title')}
              {' '}
              <span className="text-primary">{t('titleHighlight')}</span>
            </h2>
            <p className="mb-8 max-w-md text-lg text-white/50">
              {t('description')}
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:hi@agilitycreative.com"
                className="flex items-center gap-3 text-white/60 transition-colors hover:text-primary"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                  <IoMailOutline size={18} />
                </div>
                hi@agilitycreative.com
              </a>
              <a
                href="https://instagram.com/agilitycreative"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/60 transition-colors hover:text-primary"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                  <IoLogoInstagram size={18} />
                </div>
                @agilitycreative
              </a>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150} className="flex-1">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  goToWhatsapp();
                }}
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70" htmlFor="v2-name">
                    {t('nameLabel')}
                  </label>
                  <input
                    id="v2-name"
                    type="text"
                    placeholder={t('namePlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70" htmlFor="v2-email">
                    {t('emailLabel')}
                  </label>
                  <input
                    id="v2-email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70" htmlFor="v2-message">
                    {t('messageLabel')}
                  </label>
                  <textarea
                    id="v2-message"
                    rows={5}
                    placeholder={t('messagePlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                >
                  {t('submit')}
                  <FaWhatsapp size={16} />
                </button>
              </form>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
