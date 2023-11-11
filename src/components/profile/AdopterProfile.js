import { React, useState, useEffect } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../utils/links';
import AnimalCard from '../utils/AnimalCard';

export default function AdopterProfile({ adopterName }) {
  const navigate = useNavigate();
  const [favouriteAnimals, setFavouriteAnimals] = useState([]);

  useEffect(() => {
    async function getAnimals(id) {
      const adopterResult = await fetch(`${apiBaseUrl}/api/adopter/${id}`);
      const jsonAdopter = await adopterResult.json();
      const deletedAnimals = [];
      const animals = await Promise.all(
        jsonAdopter?.favourites?.map(async (animalId) => {
          const animalResponse = await fetch(`${apiBaseUrl}/api/animal/getid/${animalId}`);

          if (animalResponse.status === 404) {
            deletedAnimals.push(animalId);

            return;
          }

          const animal = await animalResponse?.json();

          return animal;
        }),
      );

      if (deletedAnimals.length) {
        await fetch(`${apiBaseUrl}/api/adopter/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favourites: jsonAdopter?.favourites?.filter(
              (animalId) => !deletedAnimals.includes(animalId),
            ),
          }),
        });
      }

      setFavouriteAnimals(animals);
    }

    getAnimals(localStorage.getItem('loggedId'));
  }, []);

  function logout() {
    localStorage.removeItem('loggedId');
    window.dispatchEvent(new Event('storage'));
    navigate('/entrar');
  }

  return (
    <div className="ACProfileBody">
      <div className="ACProfileHeader">
        <div className="ACProfileNameBox">
          <h1 className="ACProfileName">Olá, {adopterName}!</h1>
          <div title="Sair" onClick={() => logout()} style={{ cursor: 'pointer' }}>
            <IconContext.Provider value={{ color: '#1C3144', size: '30px' }}>
              <BiLogOut />
            </IconContext.Provider>
          </div>
        </div>
        <button className="ACProfileEditButton" onClick={() => navigate('/perfil/editar')}>
          Editar perfil
        </button>
      </div>
      <div className="ACProfileOptions">
        <div className="ACProfileOption" onClick={() => navigate('/perfil/adocoes')}>
          <IconContext.Provider value={{ color: '#666666', size: '60px' }}>
            <HiOutlineChatBubbleOvalLeftEllipsis />
          </IconContext.Provider>
          <h2 className="ACProfileOptionTitle">Minhas adoções</h2>
        </div>
      </div>
      <div className="ACProfileAnimals">
        <div className="ACProfileTitleBox">
          <h1 className="ACProfileTitle">Pets favoritados</h1>
        </div>
        <div className="ACProfileAnimalsList">
          {favouriteAnimals.map((animal) => {
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
