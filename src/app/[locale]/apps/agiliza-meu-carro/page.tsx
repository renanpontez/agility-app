import Image from 'next/image';

import CarPriceForm from './CarPriceForm';

const CarPriceFinderPage = async () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-stone-900 p-2 text-white lg:p-10">
      <Image src="/assets/images/agiliza-meu-carro/logo.png" alt="Agiliza Meu Carro" width={200} height={200} className="mb-5 lg:mb-10" />

      <CarPriceForm />
    </div>
  );
};

export default CarPriceFinderPage;
