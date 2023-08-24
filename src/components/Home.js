import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import { useNavigate } from 'react-router-dom';
import AnimalCard from './utils/AnimalCard';

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAnimals() {
      const response = await fetch(`${apiBaseUrl}/api/animal/`);
      const jsonResponse = (await response?.json()) ?? [];

      setAnimals(jsonResponse);
    }

    getAnimals();
  }, []);

  return (
    <div className="homeBody">
      <div className="homeAnimalsSection">
        <h2 className="homeSubtitle">Pets em destaque</h2>
        <p className="homeDescription">
          Encontre o seu pet e faça a diferença na vida de um animal em busca de um lar!
        </p>
        <div className="homeAnimals">
          <div className="homeScroll">
            {animals?.slice(0, 20).map((animal) => {
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
    </div>
  );
}
