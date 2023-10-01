import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import { useNavigate } from 'react-router-dom';
import AnimalCard from './utils/AnimalCard';
import Select from 'react-select';
import { useParams } from 'react-router-dom';

export default function Ong() {
  const { id } = useParams();
  const [ong, setOng] = useState({});
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [filters, setFilters] = useState({});
  const [species, setSpecies] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sex, setSex] = useState([]);
  const navigate = useNavigate();

  const selectStyle = {
    control: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: 'rgba(63, 137, 197, 0.25)',
      marginBottom: '20px',
      fontSize: '18px',
      color: '#1C3144',
      borderRadius: '10px',
      border: '1px solid #3F88C5',
      outline: 'none',
    }),
  };

  useEffect(() => {
    async function getAnimals() {
      const response = await fetch(`${apiBaseUrl}/api/animal/getong`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _idAdoptionCenter: id }),
      });
      const jsonResponse = (await response?.json()) ?? [];

      setAnimals(jsonResponse);
      setFilteredAnimals(jsonResponse);

      const uniqueSpecies = [...new Set(jsonResponse.map(({ species }) => species))];
      const uniqueSizes = [...new Set(jsonResponse.map(({ size }) => size))];
      const uniqueSex = [...new Set(jsonResponse.map(({ sex }) => sex))];

      setSpecies(uniqueSpecies.map((species) => ({ value: species, label: species })));
      setSizes(uniqueSizes.map((size) => ({ value: size, label: size })));
      setSex(uniqueSex.map((sex) => ({ value: sex, label: sex })));
    }

    getAnimals();
  }, [id]);

  useEffect(() => {
    async function getOng() {
      const adoptionCenter = await fetch(`${apiBaseUrl}/api/adoptionCenter/${id}`);
      const jsonAdoptionCenter = (await adoptionCenter?.json()) ?? {};

      setOng(jsonAdoptionCenter);

      console.log(jsonAdoptionCenter);
    }

    getOng();
  }, [id]);

  function handleSpecieChange(value) {
    const newFilter = { ...filters, species: value.map(({ value }) => value) };

    setFilters(newFilter);
    getFilteredAnimals(newFilter);
  }

  function handleSizeChange(value) {
    const newFilter = { ...filters, size: value.map(({ value }) => value) };

    setFilters(newFilter);
    getFilteredAnimals(newFilter);
  }

  function handleSexChange(value) {
    const newFilter = { ...filters, sex: value.map(({ value }) => value) };

    setFilters(newFilter);
    getFilteredAnimals(newFilter);
  }

  function getFilteredAnimals(filter) {
    setFilteredAnimals(
      animals.filter((animal) => {
        if (filter.species?.length && !filter.species.includes(animal?.species)) return false;

        if (filter.size?.length && !filter.size.includes(animal?.size)) return false;

        if (filter.sex?.length && !filter.sex.includes(animal?.sex)) return false;

        return true;
      }),
    );
  }

  return (
    <div className="animalsBody">
      <div className="animalsHeader">
        <h1 className="animalsTitle">Animais disponiveis para a adoção</h1>
        {Object.keys(ong).length && (
          <div className="animalsOngInfoBox">
            <h2>{ong?.corporateName}</h2>
            <div className="ongInfoContainer">
              <div className="ongInfoColumn">
                <p>
                  Endereço:&nbsp;
                  {`${ong?.address?.streetName}, ${ong?.address?.number} - \
${ong?.address?.district}, ${ong?.address?.city} - ${ong?.address?.state}`}
                </p>
                <p>
                  CEP:&nbsp;
                  {ong?.address?.zipCode
                    ?.replace(/\D/g, '')
                    .replace(/(\d{5})(\d)/, '$1-$2')
                    .replace(/(-\d{3})\d+?$/, '$1')}
                </p>
                <p>
                  CNPJ:&nbsp;
                  {ong?.CNPJ.replace(/\D+/g, '')
                    .replace(/(\d{2})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1/$2')
                    .replace(/(\d{4})(\d)/, '$1-$2')
                    .replace(/(-\d{2})\d+?$/, '$1')}
                </p>
              </div>
              <div className="ongInfoColumn">
                <p>E-mail: {ong?.email}</p>
                <p>
                  Telefone:&nbsp;
                  {ong?.telephone
                    ?.replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d)(\d{4})$/, '$1-$2')}
                </p>
                <p>Data de cadastro: {new Date(ong?.createdAt)?.toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="animalsSection">
        <div className="animalsFilterContainer">
          <div className="animalsFilter">
            <Select
              name="specie"
              options={species}
              isMulti
              placeholder="Espécie"
              onChange={(value) => handleSpecieChange(value)}
              styles={selectStyle}
            />
            <Select
              name="size"
              options={sizes}
              isMulti
              placeholder="Porte"
              onChange={(value) => handleSizeChange(value)}
              styles={selectStyle}
            />
            <Select
              name="sex"
              options={sex}
              isMulti
              placeholder="Sexo"
              onChange={(value) => handleSexChange(value)}
              styles={selectStyle}
            />
          </div>
        </div>
        <div className="animalsList">
          {filteredAnimals?.map((animal) => {
            return (
              <AnimalCard
                animalInfo={animal}
                key={animal._id}
                buttonOptions={{
                  buttonText: 'Ver mais',
                  buttonFunction: () => navigate(`/animais/${animal._id}`),
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
