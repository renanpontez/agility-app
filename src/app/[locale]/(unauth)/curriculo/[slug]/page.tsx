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
    <div>
      Hello world
    </div>
  );
};

export default CVPage;
