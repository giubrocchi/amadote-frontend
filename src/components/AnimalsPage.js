import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import { useNavigate } from 'react-router-dom';
import AnimalCard from './utils/AnimalCard';
import Select from 'react-select';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [filters, setFilters] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [species, setSpecies] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sex, setSex] = useState([]);
  const navigate = useNavigate();

  const selectStyle = {
    control: (baseStyles, state) => ({
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
      const response = await fetch(`${apiBaseUrl}/api/animal/`);
      const jsonResponse = (await response?.json()) ?? [];

      const mappedAnimals = await Promise.all(
        jsonResponse?.map(async (animal) => {
          const adoptionCenter = await fetch(
            `${apiBaseUrl}/api/adoptionCenter/${animal?._idAdoptionCenter}`,
          );
          const jsonAdoptionCenter = (await adoptionCenter?.json()) ?? {};

          return { ...animal, adoptionCenter: jsonAdoptionCenter };
        }),
      );

      setAnimals(mappedAnimals);
      setFilteredAnimals(mappedAnimals);

      const uniqueStates = [
        ...new Set(mappedAnimals.map(({ adoptionCenter }) => adoptionCenter.address.state)),
      ];
      const uniqueCities = [
        ...new Set(mappedAnimals.map(({ adoptionCenter }) => adoptionCenter.address.city)),
      ];
      const uniqueSpecies = [...new Set(mappedAnimals.map(({ species }) => species))];
      const uniqueSizes = [...new Set(mappedAnimals.map(({ size }) => size))];
      const uniqueSex = [...new Set(mappedAnimals.map(({ sex }) => sex))];

      setStates(uniqueStates.map((state) => ({ value: state, label: state })));
      setCities(uniqueCities.map((city) => ({ value: city, label: city })));
      setSpecies(uniqueSpecies.map((species) => ({ value: species, label: species })));
      setSizes(uniqueSizes.map((size) => ({ value: size, label: size })));
      setSex(uniqueSex.map((sex) => ({ value: sex, label: sex })));
    }

    getAnimals();
  }, []);

  function handleStateChange(value) {
    const newFilter = { ...filters, state: value.map(({ value }) => value) };

    setFilters(newFilter);
    getFilteredAnimals(newFilter);
  }

  function handleCityChange(value) {
    const newFilter = { ...filters, city: value.map(({ value }) => value) };

    setFilters(newFilter);
    getFilteredAnimals(newFilter);
  }

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
        if (filter.state?.length && !filter.state.includes(animal?.adoptionCenter?.address?.state))
          return false;

        if (filter.city?.length && !filter.city.includes(animal?.adoptionCenter?.address?.city))
          return false;

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
        <div style={{ display: 'inline' }}>
          <p className="animalsDescription">
            Encontre aqui o seu pet ideal para você enche-lo de amor e carinho. Não encontrou o seu
            pet aqui ainda?
            <br />
            Complete o seu&nbsp;
          </p>
          <p
            className="animalsDescription"
            style={{
              textDecoration: 'underline',
              display: 'inline',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/cadastrar')}
          >
            cadastro
          </p>
          <p className="animalsDescription">&nbsp;e/ou faça o&nbsp;</p>
          <p
            className="animalsDescription"
            style={{
              textDecoration: 'underline',
              display: 'inline',
              cursor: 'pointer',
            }}
          >
            teste de match
          </p>
          <p className="animalsDescription">
            &nbsp;para te avisarmos quando tivermos mais animais disponiveis pertinho de você!
          </p>
        </div>
      </div>
      <div className="animalsSection">
        <div className="animalsFilterContainer">
          <div className="animalsFilter">
            <Select
              name="state"
              options={states}
              isMulti
              placeholder="Estado"
              onChange={(value) => handleStateChange(value)}
              styles={selectStyle}
            />
            <Select
              name="city"
              options={cities}
              isMulti
              placeholder="Cidade"
              onChange={(value) => handleCityChange(value)}
              styles={selectStyle}
            />
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
          {filteredAnimals?.slice(0, 20).map((animal) => {
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
