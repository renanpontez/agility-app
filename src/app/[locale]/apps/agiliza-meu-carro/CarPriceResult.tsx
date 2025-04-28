import Text from '@/components/Text';

type Result = {
  price?: string;
  model?: string;
};

const CarPriceResult = ({ result }: { result?: Result }) => {
  // Removed unused variable and improved parsing logic with regex
  const retailPrice = result?.price
    ? Number.parseFloat(result.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) * 0.85
    : null;

  const formattedRetailPrice = retailPrice
    ? retailPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    : null;

  return (
    <div className="w-full rounded-lg bg-stone-950 p-5 shadow-lg lg:w-1/2 lg:px-10">
      <Text as="p">
        Resultados para o veículo:
        {' '}
        {result?.model}
      </Text>
      <div className="mt-5 flex flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-semibold">FIPE</span>
            <span>{result?.price || 'N/A'}</span>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <span className="font-semibold">Concessionária (est.)</span>
          <span>{formattedRetailPrice || 'N/A'}</span>
        </div>
        <div className="flex w-full flex-col">
          <span className="font-semibold">Webmotors (média)</span>
          <span>{formattedRetailPrice || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default CarPriceResult;
