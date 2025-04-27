'use client';
import { useEffect, useState } from 'react';

import Button from '@/components/Button';

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
  const [searchResult, setSearchResult] = useState();

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
    fetch(`https://busca-fipe.onrender.com/fipe/marcas/${maker}/modelos/${model}/anos/${year}/busca`)
      .then(res => res.json())
      .then(data => setSearchResult(data))
      .catch(err => console.error(err));
  };

  return (
    <>
      <div className="flex w-full flex-row gap-10">
        <div className="rounded-lg bg-gray-700 p-3 shadow">
          <select
            className="w-56 rounded bg-gray-700 p-2 text-white"
            value={maker}
            onChange={e => setMaker(e.target.value)}
          >
            <option value="" disabled>Marca</option>
            {makers.map((eachMaker: Maker) => (
              <option key={eachMaker.id} value={eachMaker.id}>{eachMaker.name}</option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-gray-700 p-3 shadow">
          <select
            className="w-56 rounded bg-gray-700 p-2 text-white"
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

        <div className="rounded-lg bg-gray-700 p-3 shadow">
          <select
            className="w-56 rounded bg-gray-700 p-2 text-white"
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

        <Button
          style="secondary"
          onClick={handleSearch}
          disabled={!year}
        >
          Buscar veículo
        </Button>

      </div>

      <CarPriceResult result={searchResult} />
    </>
  );
};

export default CarPriceForm;
