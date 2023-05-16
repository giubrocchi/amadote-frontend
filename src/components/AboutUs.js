import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import { useNavigate } from 'react-router-dom';
import AnimalCard from './utils/AnimalCard';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAnimals(){
      const response = await fetch(`${apiBaseUrl}/api/animal/`);
      const jsonResponse = await response?.json() ?? [];

      setAnimals(jsonResponse);
    }

    getAnimals();
  }, []);

  return (
    <div className='animalsBody'>
      <div className='animalsHeader'>
        <h1 className='animalsTitle'>Sobre o Amadote</h1>
        <p className='animalsDescription'>o Amadote é uma plataforma de adoção responsável de animais que conecta ONGs de proteção animal e adotantes em potencial.</p>
      </div>
      <div className='animalsHeader'>
        <h1 className='animalsTitle'>Sobre nós</h1>
        <p className='animalsDescription'>Nós somos um grupo de estudantes apaixonados por animais e estamos comprometidos em ajudar ONGs e adotantes a encontrarem a melhor combinação para a adoção responsável de animais de estimação. Criamos esta plataforma para facilitar e tornar mais eficiente o processo de adoção, visando garantir o bem-estar dos animais e a satisfação dos adotantes.</p>
      </div>
      <div className='animalsSection'>
        <div className='animalsFilter'></div>
        <div className='animalsList'>
          {
            animals?.slice(0, 20).map(animal => {
              return <AnimalCard 
                animalInfo={animal}
                key={animal._id}
                buttonOptions={{ buttonText: 'Ver mais', buttonFunction: () => navigate(`/animais/${animal._id}`) }}
              />
            })
          }
        </div>
      </div>
    </div>
  )
}
