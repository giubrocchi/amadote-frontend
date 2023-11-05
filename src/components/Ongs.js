import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

export default function Ongs() {
  const [ongs, setOngs] = useState([]);
  const [filteredOngs, setFilteredOngs] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({});
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
    async function getOngs() {
      const response = await fetch(`${apiBaseUrl}/api/adoptionCenter/`);
      const jsonResponse = (await response?.json()) ?? [];

      setOngs(jsonResponse);
      setFilteredOngs(jsonResponse);

      const uniqueStates = [...new Set(jsonResponse.map(({ address }) => address.state))];
      const uniqueCities = [...new Set(jsonResponse.map(({ address }) => address.city))];

      setStates(uniqueStates.map((state) => ({ value: state, label: state })));
      setCities(uniqueCities.map((city) => ({ value: city, label: city })));
    }

    getOngs();
  }, []);

  function handleStateChange(value) {
    const newFilter = { ...filters, state: value.map(({ value }) => value) };

    setFilters(newFilter);
    getFilteredOngs(newFilter);
  }

  function handleCityChange(value) {
    const newFilter = { ...filters, city: value.map(({ value }) => value) };

    setFilters(newFilter);
    getFilteredOngs(newFilter);
  }

  function getFilteredOngs(filter) {
    setFilteredOngs(
      ongs.filter((ong) => {
        if (filter.state?.length && !filter.state.includes(ong?.address?.state)) return false;

        if (filter.city?.length && !filter.city.includes(ong?.address?.city)) return false;

        return true;
      }),
    );
  }

  console.log(ongs);

  return (
    <div className="ongsBody">
      <div className="animalsHeader">
        <h1 className="animalsTitle">ONGs cadastradas</h1>
        <p className="animalsDescription">
          Aqui você encontra as ONGs cadastrada em nossa plataforma, podendo visualizar suas
          informações e procurar por seus animais em adoção!
        </p>
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
          </div>
        </div>
        <div className="ongsList">
          {filteredOngs?.map((ong) => {
            return (
              <div className="ongBox" key={ong?._id} onClick={() => navigate(`/ongs/${ong?._id}`)}>
                <h1 className="ongCorporateName">{ong?.corporateName}</h1>
                <div className="ongDetails">
                  <span className="inlineInfo">
                    <p className="boldInfo">Cidade:</p>
                    <p>{ong?.address?.city}</p>
                  </span>
                  <span className="inlineInfo">
                    <p className="boldInfo">Estado:</p>
                    <p>{ong?.address?.state}</p>
                  </span>
                  <span className="inlineInfo">
                    <p className="boldInfo">E-mail:</p>
                    <p>{ong?.email}</p>
                  </span>
                  <span className="inlineInfo">
                    <p className="boldInfo">Telefone:</p>
                    <p>
                      {ong?.telephone
                        ?.replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '($1) $2')
                        .replace(/(\d)(\d{4})$/, '$1-$2')}
                    </p>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
