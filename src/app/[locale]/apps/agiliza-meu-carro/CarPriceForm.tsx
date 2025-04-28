'use client';
import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import Loading from '@/components/Loading/Loading';

import CarPriceResult from './CarPriceResult';

type Maker = {
  id: string;
  name: string;
};
type Model = {
  id: string;
  name: string;
};
type Year = {
  id: string;
  name: string;
};

const CarPriceForm: React.FC = () => {
  const [maker, setMaker] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [makers, setMakers] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetch('https://busca-fipe.onrender.com/fipe/marcas')
      .then(res => res.json())
      .then(data => setMakers(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (maker) {
      fetch(`https://busca-fipe.onrender.com/fipe/marcas/${maker}/modelos`)
        .then(res => res.json())
        .then(data => setModels(data))
        .catch(err => console.error(err));
    } else {
      setModels([]);
    }
  }, [maker]);

  useEffect(() => {
    if (model) {
      fetch(`https://busca-fipe.onrender.com/fipe/marcas/${maker}/modelos/${model}/anos`)
        .then(res => res.json())
        .then(data => setYears(data))
        .catch(err => console.error(err));
    } else {
      setYears([]);
    }
  }, [model]);

  const handleSearch = () => {
    if (!maker || !model || !year) {
      return;
    }
    setLoading(true);
    setError(null);
    setSearchResult(null);

    fetch(`https://busca-fipe.onrender.com/fipe/marcas/${maker}/modelos/${model}/anos/${year}/busca`)
      .then(res => res.json())
      .then(data => setSearchResult(data))
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="relative mx-auto flex w-full flex-col items-center justify-start gap-10 rounded-lg bg-stone-900 p-5 lg:my-10">
      <div className="relative flex w-full flex-col gap-10 rounded-lg bg-stone-950 p-8 shadow-lg lg:w-1/2 lg:flex-row">
        <div>
          <h1 className="mb-0 text-lg">FIPE Atualizada</h1>
          <h2 className="mb-0 text-sm">Descubra quanto vale seu carro no mercado atualmente</h2>

          {error && (
            <div className="mt-2 text-sm text-red-500">
              Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-10">
          <div className="rounded-lg bg-stone-800 p-3 shadow">
            <select
              className="w-full rounded bg-stone-800 p-2 text-white"
              value={maker}
              onChange={e => setMaker(e.target.value)}
            >
              <option value="" disabled>Qual a marca do veículo?</option>
              {makers.map((eachMaker: Maker) => (
                <option key={eachMaker.id} value={eachMaker.id}>{eachMaker.name}</option>
              ))}
            </select>
          </div>
          {(maker && !!models.length) && (
            <div className="rounded-lg bg-stone-800 p-3 shadow">
              <select
                className="w-full rounded bg-stone-800 p-2 text-white"
                value={model}
                onChange={e => setModel(e.target.value)}
                disabled={!maker}
              >
                <option value="">Modelo</option>
                {models.map((eachModel: Model) => (
                  <option key={eachModel.id} value={eachModel.id}>{eachModel.name}</option>
                ))}
              </select>
            </div>
          )}
          {(model && !!years.length) && (
            <div className="rounded-lg bg-stone-800 p-3 shadow">
              <select
                className="w-full rounded bg-stone-800 p-2 text-white"
                value={year}
                onChange={e => setYear(e.target.value)}
                disabled={!model}
              >
                <option value="">Ano</option>
                {years.map((year: Year) => (
                  <option key={year.id} value={year.id}>{year.name}</option>
                ))}
              </select>
            </div>
          )}
          {maker && model && year && (
            <Button
              style="secondary"
              onClick={handleSearch}
              disabled={!year}
              className="w-full rounded-lg bg-green-500 p-3 text-white shadow hover:bg-green-600 active:bg-green-700"
            >
              Buscar veículo
            </Button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 h-2 w-full rounded bg-stone-700">
          <div
            className="h-full rounded bg-green-500 transition-all"
            style={{
              width: `${[maker, model, year].filter(Boolean).length / 3 * 100}%`,
            }}
          />
        </div>
      </div>
      {loading && (
        <div className="mt-10 flex w-1/2 justify-center gap-10 rounded-lg bg-stone-950 p-8 shadow-lg">
          <Loading size="medium" iconClassName="fill-secondary" />
        </div>
      )}

      {searchResult && (
        <CarPriceResult result={searchResult} />
      )}
    </div>
  );
};

export default CarPriceForm;
