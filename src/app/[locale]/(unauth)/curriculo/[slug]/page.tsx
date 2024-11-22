import Image from 'next/image';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Text from '@/components/Text';
import CVData from '@/data/cv.json';
import type { UserProfile } from '@/types/cv';

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  return CVData.map((item: UserProfile) => ({
    slug: item.slug,
  }));
}

const CVPage = async ({ params }: { params: Params }) => {
  const selectedCV = CVData.find((item: UserProfile) => item.slug === params.slug);

  if (!selectedCV) {
    return <p>Currículo virtual não encontrado</p>;
  }
  return (

    <div className="pb-20">
      <div className="container space-y-20 pt-6">
        <section className="space-y-5">
          <div className="flex justify-between">
            <Button
              style="outlined-gray"
              icon={(
                <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 0C5.76036 0 5.97143 0.197521 5.97143 0.441176V5.84667L7.36665 4.54098C7.55075 4.36869 7.84925 4.36869 8.03335 4.54098C8.21745 4.71327 8.21745 4.99261 8.03335 5.1649L5.83335 7.22372C5.64925 7.39601 5.35075 7.39601 5.16665 7.22372L2.96665 5.1649C2.78255 4.99261 2.78255 4.71327 2.96665 4.54098C3.15075 4.36869 3.44925 4.36869 3.63335 4.54098L5.02857 5.84667V0.441176C5.02857 0.197521 5.23964 0 5.5 0ZM10.5286 6.76471C10.7889 6.76471 11 6.96223 11 7.20588V7.79412C11 8.37915 10.7517 8.94023 10.3096 9.35391C9.86756 9.7676 9.26801 10 8.64286 10H2.35714C1.73199 10 1.13244 9.7676 0.690391 9.35391C0.248341 8.94023 0 8.37915 0 7.79412V7.20824C0 6.96458 0.211066 6.76706 0.471429 6.76706C0.731791 6.76706 0.942857 6.96458 0.942857 7.20824V7.79412C0.942857 8.14514 1.09186 8.48178 1.35709 8.72999C1.62232 8.9782 1.98205 9.11765 2.35714 9.11765H8.64286C9.01795 9.11765 9.37768 8.9782 9.64291 8.72999C9.90814 8.48178 10.0571 8.14514 10.0571 7.79412V7.20588C10.0571 6.96223 10.2682 6.76471 10.5286 6.76471Z" fill="white" />
                </svg>
              )}
            >
              CV
            </Button>
            <Image
              alt="br-brand"
              src="/assets/images/icons/brasil-brand.png"
              className="h-4 w-6"
              width={24}
              height={17}
            >
            </Image>
          </div>

          <Image src={selectedCV.image} alt="user-cv-image" width={440} height={440} className="mx-auto max-h-40 max-w-40"></Image>
          <div>
            <Text as="h5" size="3xl" className="mb-2 text-center">{selectedCV.name.toUpperCase()}</Text>
            <div className="flex border-separate items-center justify-center gap-2 font-thin opacity-35">
              {selectedCV.jobs.map((job, index) => <Text as="p" size="xs" key={index}>{job.toUpperCase()}</Text>) }
            </div>

          </div>
          <Text as="p" className="text-secondaryLighter">{selectedCV.personalDescription}</Text>
          <Text as="p" className="text-secondaryLighter">{selectedCV.workDescription}</Text>
          <div className="flex justify-center gap-3 pt-4">
            <Button
              style="outlined-gray"
              className="rounded-md"
              size="lg"
              icon={(
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.51203 4.83217C4.51191 4.83204 4.51171 4.83205 4.51159 4.83217C4.38844 4.96748 4.22157 5.04348 4.04758 5.04348C3.87349 5.04348 3.70652 4.96739 3.58335 4.83193L1.1054 2.1044C0.982224 1.9687 0.913045 1.78468 0.913086 1.59281C0.913127 1.40095 0.982384 1.21697 1.10562 1.08133C1.22886 0.945696 1.39598 0.869523 1.57023 0.869568C1.74447 0.869613 1.91156 0.945874 2.03474 1.08157C3.11368 2.26961 4.98148 2.26961 6.06042 1.08157C6.18426 0.949742 6.35017 0.876744 6.52242 0.878302C6.69467 0.87986 6.85947 0.955849 6.98133 1.0899C7.10318 1.22396 7.17235 1.40535 7.17393 1.59501C7.17551 1.78467 7.10937 1.96743 6.98976 2.10392L4.51247 4.83217C4.51235 4.8323 4.51215 4.8323 4.51203 4.83217Z" fill="white" />
                </svg>
              )}
            >
              Ver meu portfolio
            </Button>
            <Button
              style="primary"
              size="lg"
              className="rounded-md"
              icon={(
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5666 2.61373C10.9897 2.03101 10.3026 1.56899 9.54528 1.25462C8.78797 0.940243 7.97564 0.779804 7.15568 0.782661C3.72006 0.782661 0.919968 3.58275 0.919968 7.01837C0.919968 7.90034 1.10565 8.76213 1.45762 9.55523C1.62594 9.9345 1.68927 10.3581 1.58023 10.7584C1.26429 11.9184 2.32205 12.9856 3.48475 12.6799L3.5567 12.661C3.9526 12.557 4.36982 12.6166 4.74733 12.7749C5.50655 13.0933 6.32515 13.2604 7.15568 13.2604C10.5913 13.2604 13.3914 10.4603 13.3914 7.02466C13.3914 5.35719 12.7433 3.7904 11.5666 2.61373ZM7.15568 12.2033C6.22441 12.2033 5.31202 11.9516 4.51289 11.4796C4.39218 11.4072 4.24736 11.3865 4.11121 11.4223L3.88576 11.4816C3.20803 11.6597 2.59161 11.0374 2.77618 10.3614L2.82204 10.1934C2.86095 10.0509 2.83742 9.89855 2.75733 9.77441C2.23994 8.94821 1.96521 7.9932 1.9645 7.01837C1.9645 4.16165 4.29266 1.83348 7.14938 1.83348C8.5337 1.83348 9.83621 2.37462 10.8115 3.35623C11.2945 3.83694 11.6772 4.40872 11.9375 5.03844C12.1978 5.66815 12.3305 6.34327 12.328 7.02466C12.3406 9.88138 10.0124 12.2033 7.15568 12.2033ZM9.99981 8.32718C9.8425 8.25167 9.07484 7.87413 8.93641 7.8175C8.79168 7.76716 8.69101 7.74199 8.58404 7.893C8.47707 8.05031 8.18133 8.40268 8.09324 8.50336C8.00514 8.61033 7.91076 8.62292 7.75345 8.54111C7.59614 8.46561 7.09275 8.29571 6.50127 7.76716C6.03564 7.35186 5.72732 6.84218 5.63293 6.68487C5.54484 6.52757 5.62035 6.44577 5.70215 6.36397C5.77136 6.29475 5.85945 6.18149 5.93496 6.09339C6.01047 6.0053 6.04193 5.93609 6.09227 5.83541C6.14261 5.72844 6.11744 5.64035 6.07969 5.56484C6.04193 5.48933 5.72731 4.72167 5.60147 4.40705C5.47562 4.10502 5.34348 4.14277 5.2491 4.13648H4.94706C4.84009 4.13648 4.67649 4.17423 4.53177 4.33154C4.39334 4.48885 3.99063 4.86639 3.99063 5.63405C3.99063 6.40172 4.55065 7.14422 4.62616 7.24489C4.70166 7.35186 5.72732 8.92495 7.28782 9.59823C7.65906 9.76183 7.94851 9.85621 8.17503 9.92543C8.54628 10.045 8.88607 10.0261 9.15664 9.98835C9.45867 9.94431 10.0816 9.61081 10.2075 9.24586C10.3396 8.8809 10.3396 8.57258 10.2956 8.50336C10.2515 8.43415 10.1571 8.40268 9.99981 8.32718Z" fill="white" />
                </svg>
              )}
            >
              Enviar mensagem
            </Button>
            {' '}

          </div>
        </section>

        <section className="space-y-4">
          <span className="flex items-center gap-2">
            <Image src="/assets/images/icons/agility-rotated.png" className="size-4" alt="agility-logo-rotated" width={11} height={10}></Image>
            <Text as="h5">
              Habilidades
            </Text>
          </span>
          <div className="flex gap-3 overflow-x-hidden scroll-smooth">
            {selectedCV.skills.map((skill, index) => (
              <Card key={index} style="outlined-gray" className="flex min-w-40 flex-col justify-start space-y-2 pt-20">
                <Image src={skill.icon} alt="skill-icon" width={10} height={10} className="size-4"></Image>
                <Text as="p">{skill.name}</Text>
                <Text as="p" size="xxs" className=" text-secondaryLighter">{skill.description}</Text>
              </Card>
            ),
            )}
          </div>

        </section>
        <section className="space-y-4">
          <span className="flex items-center gap-2">
            <Image src="/assets/images/icons/agility-rotated.png" className="size-4" alt="agility-logo-rotated" width={11} height={10}></Image>
            <Text as="h5">
              Portfolio
            </Text>
          </span>

          <div className="flex gap-2 overflow-x-hidden scroll-smooth">
            {selectedCV.portfolio.map((project, index) => (
              <Card key={index} backgroundImage={project.image} className="flex min-h-72 min-w-72 flex-col justify-end space-y-1">
                <Text as="p">{project.name}</Text>
                <Text as="p" size="xs" className="text-secondaryLighter">{project.description}</Text>
              </Card>
            ),
            )}
          </div>
        </section>

        <section className="space-y-4">
          <span className="flex items-center gap-2">
            <Image
              width={11}
              height={10}
              className="size-4"
              src="/assets/images/icons/agility-rotated.png"
              alt="agility-logo-rotated"
            >
            </Image>
            <Text as="h5">
              Recomendações
            </Text>
          </span>

          <div className="flex items-center gap-2 overflow-x-hidden scroll-smooth">
            {selectedCV.recommendations.map((recommendation, index) => (
              <div key={index} className="flex min-w-96 justify-start gap-3 bg-transparent">
                <Image src={recommendation.image} alt="recommendation-icon" width={36} height={36} className="size-12 rounded-full"></Image>
                <div className="space-y-1">
                  <Text as="p" size="xs" decoration="italic">
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

      </div>
      <section className=" mt-20 bg-secondaryEvenDarker py-12">
        <div className="container flex flex-col space-y-4">
          <Text as="h2" className="px-10 text-center leading-normal"> Conte-me sobre seu próximo projeto!</Text>
          <Text as="p" className="px-16 pb-6 text-center text-secondaryLighter">
            Veja como eu posso te ajudar a transformar ideias em realidade de um jeito mágico e prático.
          </Text>
          <Button
            style="primary"
            size="lg"
            className="mx-auto mt-6"
            icon={(
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5666 2.61373C10.9897 2.03101 10.3026 1.56899 9.54528 1.25462C8.78797 0.940243 7.97564 0.779804 7.15568 0.782661C3.72006 0.782661 0.919968 3.58275 0.919968 7.01837C0.919968 7.90034 1.10565 8.76213 1.45762 9.55523C1.62594 9.9345 1.68927 10.3581 1.58023 10.7584C1.26429 11.9184 2.32205 12.9856 3.48475 12.6799L3.5567 12.661C3.9526 12.557 4.36982 12.6166 4.74733 12.7749C5.50655 13.0933 6.32515 13.2604 7.15568 13.2604C10.5913 13.2604 13.3914 10.4603 13.3914 7.02466C13.3914 5.35719 12.7433 3.7904 11.5666 2.61373ZM7.15568 12.2033C6.22441 12.2033 5.31202 11.9516 4.51289 11.4796C4.39218 11.4072 4.24736 11.3865 4.11121 11.4223L3.88576 11.4816C3.20803 11.6597 2.59161 11.0374 2.77618 10.3614L2.82204 10.1934C2.86095 10.0509 2.83742 9.89855 2.75733 9.77441C2.23994 8.94821 1.96521 7.9932 1.9645 7.01837C1.9645 4.16165 4.29266 1.83348 7.14938 1.83348C8.5337 1.83348 9.83621 2.37462 10.8115 3.35623C11.2945 3.83694 11.6772 4.40872 11.9375 5.03844C12.1978 5.66815 12.3305 6.34327 12.328 7.02466C12.3406 9.88138 10.0124 12.2033 7.15568 12.2033ZM9.99981 8.32718C9.8425 8.25167 9.07484 7.87413 8.93641 7.8175C8.79168 7.76716 8.69101 7.74199 8.58404 7.893C8.47707 8.05031 8.18133 8.40268 8.09324 8.50336C8.00514 8.61033 7.91076 8.62292 7.75345 8.54111C7.59614 8.46561 7.09275 8.29571 6.50127 7.76716C6.03564 7.35186 5.72732 6.84218 5.63293 6.68487C5.54484 6.52757 5.62035 6.44577 5.70215 6.36397C5.77136 6.29475 5.85945 6.18149 5.93496 6.09339C6.01047 6.0053 6.04193 5.93609 6.09227 5.83541C6.14261 5.72844 6.11744 5.64035 6.07969 5.56484C6.04193 5.48933 5.72731 4.72167 5.60147 4.40705C5.47562 4.10502 5.34348 4.14277 5.2491 4.13648H4.94706C4.84009 4.13648 4.67649 4.17423 4.53177 4.33154C4.39334 4.48885 3.99063 4.86639 3.99063 5.63405C3.99063 6.40172 4.55065 7.14422 4.62616 7.24489C4.70166 7.35186 5.72732 8.92495 7.28782 9.59823C7.65906 9.76183 7.94851 9.85621 8.17503 9.92543C8.54628 10.045 8.88607 10.0261 9.15664 9.98835C9.45867 9.94431 10.0816 9.61081 10.2075 9.24586C10.3396 8.8809 10.3396 8.57258 10.2956 8.50336C10.2515 8.43415 10.1571 8.40268 9.99981 8.32718Z" fill="white" />
              </svg>
            )}
          >
            Enviar mensagem
          </Button>
        </div>

      </section>
    </div>
  );
};

export default CVPage;
