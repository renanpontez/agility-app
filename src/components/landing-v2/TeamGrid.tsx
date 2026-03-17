'use client';

import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa6';

import RevealOnScroll from './RevealOnScroll';

const TEAM = [
  {
    photo: '/assets/images/renan_compressed.jpg',
    name: 'Renan Martins',
    role: 'Founder | Project Manager',
    linkedin: 'https://www.linkedin.com/in/renanpmartins/?locale=en_US',
    isPartner: false,
  },
  {
    photo: '/assets/images/felipe_compressed.jpg',
    name: 'Pedro Lima',
    role: 'Web Developer',
    linkedin: 'https://www.linkedin.com/in/pedro-l-1158421a1/',
    isPartner: false,
  },
  {
    photo: '/assets/images/pedro.jpeg',
    name: 'Felipe Macedo',
    role: 'Mobile Developer',
    linkedin: 'https://www.linkedin.com/in/felipemacedogomes/',
    isPartner: false,
  },
  {
    name: 'Tchê Araújo',
    role: 'Designer UI/UX',
    isPartner: true,
  },
  {
    name: 'Cynthya Alecrim',
    role: 'Social Media',
    isPartner: true,
  },
];

const TeamGrid = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
        <RevealOnScroll>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
              Nosso time
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Mentes criativas que movem a
              {' '}
              <span className="text-primary">Agility</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member, i) => (
            <RevealOnScroll key={member.name} delay={i * 100}>
              <a
                href={member.linkedin ?? '#'}
                target={member.linkedin ? '_blank' : undefined}
                rel={member.linkedin ? 'noopener noreferrer' : undefined}
                className="group block h-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all hover:border-white/10 hover:bg-white/[0.05]"
              >
                <div className="relative aspect-square overflow-hidden">
                  {member.photo
                    ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                        />
                      )
                    : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                          <span className="text-5xl font-bold text-white/30">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{member.name}</h3>
                    {member.isPartner && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Parceiro
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-primary/70">{member.role}</p>
                  {member.linkedin && (
                    <div className="mt-3 flex gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all group-hover:bg-white/10 group-hover:text-white">
                        <FaLinkedin size={14} />
                      </span>
                    </div>
                  )}
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
