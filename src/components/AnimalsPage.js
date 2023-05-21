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
        <h1 className='animalsTitle'>Animais disponiveis para a adoção</h1>

        <div style={{display: 'inline'}}>
          <p className='animalsDescription'>Encontre aqui o seu pet ideal para você enche-lo de amor e carinho.
          Não encontrou o seu pet aqui ainda?<br/>Complete o seu&nbsp;</p>
          <p className='animalsDescription' style={{textDecoration: 'underline', display: 'inline', cursor: 'pointer'}} onClick={() => navigate('/cadastrar')}>cadastro</p>
          <p className='animalsDescription'>&nbsp;e/ou faça o&nbsp;</p>
          <p className='animalsDescription' style={{textDecoration: 'underline', display: 'inline', cursor: 'pointer'}}>teste de match</p>
          <p className='animalsDescription'>&nbsp;para te avisarmos quando tivermos mais animais disponiveis pertinho de você!</p>
        </div>

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
