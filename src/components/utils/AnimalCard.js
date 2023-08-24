import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import { IconContext } from 'react-icons';

export default function AnimalCard({ animalInfo, buttonOptions }) {
  const { birthDate, _id, photos, name, species, personality, sex } = animalInfo ?? {};
  const { buttonText, buttonFunction } = buttonOptions ?? {};
  const now = new Date();
  const birth = new Date(birthDate);
  const age = Math.round((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365));
  const agePlural = age === 1 ? '' : 's';
  const months = Math.abs(now.getMonth() - birth.getMonth());
  const monthPlural = months === 1 ? 'mês' : 'meses';
  const navigate = useNavigate();

  function executeButtonAction(event) {
    buttonFunction();
    event.stopPropagation();
  }

  return (
    <div className="ACProfileAnimalBox" key={_id} onClick={() => navigate(`/animais/${_id}`)}>
      <img src={photos[0]} alt="Animal" className="ACProfileAnimalImage" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          marginTop: '5px',
        }}
      >
        <h2 className="ACProfileAnimalName">{name}</h2>
        {sex === 'F' && (
          <IconContext.Provider value={{ color: '#F9A03F', size: '25px' }}>
            <BsGenderFemale />
          </IconContext.Provider>
        )}
        {sex === 'M' && (
          <IconContext.Provider value={{ color: '#3F88C5', size: '25px' }}>
            <BsGenderMale />
          </IconContext.Provider>
        )}
      </div>
      <div className="ACProfileAnimalLabel">
        <p className="ACProfileAnimalKey">Espécie:</p>
        <p className="ACProfileAnimalValue">{species}</p>
      </div>
      <div className="ACProfileAnimalLabel">
        <p className="ACProfileAnimalKey">Idade:</p>
        <p className="ACProfileAnimalValue">
          {age > 0 ? `${age} ano${agePlural}` : `${months} ${monthPlural}`}
        </p>
      </div>
      <div className="ACProfileAnimalPersonalities">
        {personality?.map((personality) => {
          return (
            <div key={personality} className="ACProfileAnimalPersonality">
              <p>{personality}</p>
            </div>
          );
        })}
      </div>
      <button className="ACProfileAnimalButton" onClick={executeButtonAction}>
        {buttonText}
      </button>
    </div>
  );
}
