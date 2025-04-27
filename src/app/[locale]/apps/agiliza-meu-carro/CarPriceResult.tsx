type Result = {
  price?: string;
};

const CarPriceResult = ({ result }: { result?: Result }) => {
  return (
    <div>
      <div className="mt-6 text-center text-lg font-bold">
        {result?.price}
      </div>
    </div>
  );
};

export default CarPriceResult;
