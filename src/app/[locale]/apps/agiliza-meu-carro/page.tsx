import CarPriceForm from './CarPriceForm';

const CarPriceFinderPage = async () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="rounded-lg bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-xl">FIPE Atualizada</h1>
        <CarPriceForm />
      </div>
    </div>
  );
};

export default CarPriceFinderPage;
