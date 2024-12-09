import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { getAllTeamMembersInfo, getTeamMemberInfo } from 'sanityClient';

import Button from '@/components/Button';
import Card from '@/components/Card';
import DropDownImage from '@/components/DropDownImage/DropDownImage';
import Text from '@/components/Text';
import WppButton from '@/components/WppButton';
import CVData from '@/data/cv.json';
import BrasilBrand from '@/public/assets/images/brands/brasil-brand.png';
// import EUABrand from '@/public/assets/images/brands/eua-brand.png'; TODO: Translate all text to English and use DropDownImage to change.
import type { UserProfile } from '@/types/cv';
import type { TeamMember } from '@/types/sanity';

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  // Você pode retornar slugs dinâmicos do Sanity se necessário.
  const teamMembers = await getAllTeamMembersInfo(); // Implementar função para buscar os slugs.
  return teamMembers.filter((member: any) => typeof member.slug === 'string')
    .map((member: any) => ({ slug: member.slug }));
}

const CVPage = async ({ params }: { params: Params }) => {
  const teamMember: TeamMember = await getTeamMemberInfo(params.slug);
  const selectedCV = CVData.find((item: UserProfile) => item.slug === params.slug);

  if (!teamMember || !selectedCV) {
    return <p>Currículo virtual não encontrado</p>;
  }
  const [firstWord, ...rest] = teamMember.name.toUpperCase().split(' ');

  const dropDownOption = [
    { image: BrasilBrand },
  ];

  return (

    <div>
      <section className="container flex max-h-12 items-center justify-between pt-5">
        <Button
          iconRight
          size="sm"
          style="outlined-gray"
          icon={(
            <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 0C5.76036 0 5.97143 0.197521 5.97143 0.441176V5.84667L7.36665 4.54098C7.55075 4.36869 7.84925 4.36869 8.03335 4.54098C8.21745 4.71327 8.21745 4.99261 8.03335 5.1649L5.83335 7.22372C5.64925 7.39601 5.35075 7.39601 5.16665 7.22372L2.96665 5.1649C2.78255 4.99261 2.78255 4.71327 2.96665 4.54098C3.15075 4.36869 3.44925 4.36869 3.63335 4.54098L5.02857 5.84667V0.441176C5.02857 0.197521 5.23964 0 5.5 0ZM10.5286 6.76471C10.7889 6.76471 11 6.96223 11 7.20588V7.79412C11 8.37915 10.7517 8.94023 10.3096 9.35391C9.86756 9.7676 9.26801 10 8.64286 10H2.35714C1.73199 10 1.13244 9.7676 0.690391 9.35391C0.248341 8.94023 0 8.37915 0 7.79412V7.20824C0 6.96458 0.211066 6.76706 0.471429 6.76706C0.731791 6.76706 0.942857 6.96458 0.942857 7.20824V7.79412C0.942857 8.14514 1.09186 8.48178 1.35709 8.72999C1.62232 8.9782 1.98205 9.11765 2.35714 9.11765H8.64286C9.01795 9.11765 9.37768 8.9782 9.64291 8.72999C9.90814 8.48178 10.0571 8.14514 10.0571 7.79412V7.20588C10.0571 6.96223 10.2682 6.76471 10.5286 6.76471Z" fill="white" />
            </svg>
          )}
        >
          CV
        </Button>
        <DropDownImage
          options={dropDownOption}
        />
      </section>
      <div className="space-y-20 pt-8 lg:pt-24">
        <section className="container flex-row-reverse justify-between space-y-6 lg:flex">
          <div className="flex h-auto w-full basis-4/12 items-center justify-center lg:justify-end">
            <Image src={teamMember.image} alt="user-cv-image" width={800} height={450} className="max-h-52 max-w-52 rounded-full object-cover lg:max-h-114 lg:max-w-114"></Image>
          </div>
          <div className="space-y-3">
            <div>
              <Text as="h2" className="mb-2 text-center lg:text-start">
                {firstWord}
                {' '}
                <span className="font-normal">{rest.join(' ')}</span>
              </Text>
              <div className="flex border-separate items-center justify-center gap-1 font-thin opacity-35 lg:justify-start">
                {teamMember.jobs.map((job, index) => (
                  <Text as="p" size="xs" key={index}>
                    {job.toUpperCase()}
                    {index < teamMember.jobs.length - 1 && ` |`}
                  </Text>
                ))}

              </div>

            </div>
            <Text as="p" className="pt-1 text-secondaryLighter md:pt-4 lg:max-w-96 ">
              <PortableText value={teamMember.personalDescription} />
            </Text>
            <Text as="p" className="text-secondaryLighter lg:max-w-96 "><PortableText value={teamMember.workDescription}></PortableText></Text>
            <div className="flex justify-center gap-3 pt-4 lg:justify-start">
              <Button
                iconRight
                style="outlined-gray"
                className="font-light"
                size="md"
                icon={(
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.51203 4.83217C4.51191 4.83204 4.51171 4.83205 4.51159 4.83217C4.38844 4.96748 4.22157 5.04348 4.04758 5.04348C3.87349 5.04348 3.70652 4.96739 3.58335 4.83193L1.1054 2.1044C0.982224 1.9687 0.913045 1.78468 0.913086 1.59281C0.913127 1.40095 0.982384 1.21697 1.10562 1.08133C1.22886 0.945696 1.39598 0.869523 1.57023 0.869568C1.74447 0.869613 1.91156 0.945874 2.03474 1.08157C3.11368 2.26961 4.98148 2.26961 6.06042 1.08157C6.18426 0.949742 6.35017 0.876744 6.52242 0.878302C6.69467 0.87986 6.85947 0.955849 6.98133 1.0899C7.10318 1.22396 7.17235 1.40535 7.17393 1.59501C7.17551 1.78467 7.10937 1.96743 6.98976 2.10392L4.51247 4.83217C4.51235 4.8323 4.51215 4.8323 4.51203 4.83217Z" fill="white" />
                  </svg>
                )}
              >
                Ver meu portfolio
              </Button>
              <WppButton className="font-light" cellPhone={teamMember.tel} message={`Olá, ${teamMember.name}! Encontrei seu currículo na Agility Creative Solution e gostaria de saber mais sobre seu trabalho.`}></WppButton>
              {' '}

            </div>
          </div>

        </section>

        <section className="space-y-4">
          <span className="container flex items-center gap-2">
            <Image src="/assets/images/icons/agility-rotated.png" className="size-6" alt="agility-logo-rotated" width={24} height={24}></Image>
            <Text as="h4">
              Habilidades
            </Text>
          </span>
          <div className="flex gap-2 overflow-x-auto scroll-smooth pb-4 pl-8 lg:container xxs:ml-fluid-xxs xs:ml-fluid-xs sm:ml-fluid-sm mdlg:ml-fluid-mdlg lg:ml-auto lg:flex-wrap lg:gap-4 lg:overflow-hidden lg:pl-8">
            {teamMember.skills.map((skill, index) => (
              <Card key={index} style="outlined-gray" className="flex min-w-40 flex-1 flex-col justify-start space-y-2 pt-20">
                <Image src={skill.icon} alt="skill-icon" width={10} height={10} className="size-4"></Image>
                <Text as="p">{skill.name}</Text>
                <Text as="p" size="xxs" className=" text-secondaryLighter">{skill.description}</Text>
              </Card>
            ),
            )}
          </div>

        </section>
      </div>
      <section className="relative mt-20 space-y-4">
        <span className="container flex items-center gap-2">
          <Image src="/assets/images/icons/agility-rotated.png" className="size-6" alt="agility-logo-rotated" width={24} height={24}></Image>
          <Text as="h4">
            Portfolio
          </Text>
        </span>

        <div className="flex gap-2 overflow-x-auto scroll-smooth pb-4 pl-8 lg:container xxs:ml-fluid-xxs xs:ml-fluid-xs sm:ml-fluid-sm mdlg:ml-fluid-mdlg lg:ml-auto lg:flex-wrap lg:gap-4 lg:overflow-hidden lg:pl-8">
          {selectedCV.portfolio.map((project, index) => (
            <Card key={index} backgroundImage={project.image} className="flex h-auto min-h-72 min-w-72 flex-1 flex-col justify-end space-y-1">
              <Text as="p">{project.name}</Text>
              <Text as="p" size="xs" className="text-secondaryLighter">{project.description}</Text>
            </Card>
          ),
          )}
        </div>
      </section>
      <section className="mt-20 space-y-4">
        <span className="container flex items-center gap-2">
          <Image
            width={24}
            height={24}
            className="size-6"
            src="/assets/images/icons/agility-rotated.png"
            alt="agility-logo-rotated"
          >
          </Image>
          <Text as="h4">
            Recomendações
          </Text>
        </span>

        <div className="flex gap-2 overflow-x-auto scroll-smooth pb-4 pl-8 lg:container xxs:ml-fluid-xxs xs:ml-fluid-xs sm:ml-fluid-sm mdlg:ml-fluid-mdlg lg:ml-auto lg:flex-wrap lg:gap-4 lg:overflow-hidden lg:pl-8">
          {selectedCV.recommendations.map((recommendation, index) => (
            <div key={index} className="flex min-w-96 flex-1 grow items-center justify-start gap-3 bg-transparent lg:max-w-128">
              <Image src={recommendation.image} alt="recommendation-icon" width={36} height={36} className="size-12 rounded-full lg:size-24"></Image>
              <div className="space-y-1">
                <Text as="p" size="xs" className="lg:text-base">
                  "
                  {recommendation.text}
                  "
                </Text>
                <Text as="p" size="xxs" className="font-thin text-secondaryLighter">{recommendation.author}</Text>
              </div>
            </div>
          ),
          )}
        </div>
      </section>

      <section className="mt-20 bg-secondaryEvenDarker py-10 md:pb-36">
        <div className="container flex flex-col space-y-4 md:space-y-9">
          <Text as="h3" className="px-7 text-center leading-normal"> Conte-me sobre seu próximo projeto!</Text>
          <Text as="p" className="mx-auto max-w-128 px-16 pb-6 text-center text-secondaryLighter">
            Veja como eu posso te ajudar a transformar ideias em realidade de um jeito mágico e prático.
          </Text>
          <WppButton className="mx-auto max-w-52 font-light" cellPhone={teamMember.tel} message={`Olá, ${teamMember.name}! Encontrei seu currículo na Agility Creative Solution e gostaria de saber mais sobre seu trabalho.`}></WppButton>
        </div>

      </section>
    </div>
  );
};

export default CVPage;
