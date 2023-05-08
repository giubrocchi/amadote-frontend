import { React, useState, useEffect } from 'react';
import { BiPlus, BiLogOut } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import CreateAnimalModal from './CreateAnimalModal';
import EditAnimalModal from './EditAnimalModal';
import './AdoptionCenterProfile.css';
import { apiBaseUrl } from '../utils/links';
import { useNavigate } from 'react-router-dom';

export default function AdoptionCenterProfile({corporateName}) {
  const [isAnimalModalOpen, setAnimalModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [editId, setEditId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function getAnimals(id){
      const response = await fetch(`${apiBaseUrl}/api/animal/getong`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _idAdoptionCenter: id })
      });
      const jsonResponse = await response?.json() ?? [];

      setAnimals(jsonResponse);
    }

    getAnimals(localStorage.getItem('loggedId'));
  }, []);

  function openAnimalModal(value){
    setAnimalModalOpen(value);
  }

  function editAnimal(id, value){
    setEditId(id);
    setEditModalOpen(value);
  }

  function logout(){
    localStorage.removeItem('loggedId');
    navigate('/entrar');
  }

  return (
    <div className='ACProfileBody'>
      {isAnimalModalOpen &&
        <CreateAnimalModal setAnimalModalOpen={setAnimalModalOpen}/>
      }
      {isEditModalOpen &&
        <EditAnimalModal editAnimal={editAnimal} id={editId}/>
      }
      <div className='ACProfileHeader'>
        <div className='ACProfileNameBox'>
          <h1 className='ACProfileName'>Olá, {corporateName}!</h1>
          <div title="Sair" onClick={() => logout()}>
            <IconContext.Provider value={{color: "#1C3144", size:'30px', cursor: 'poniter'}}>
              <BiLogOut />
            </IconContext.Provider>
          </div>
        </div>
        <button className='ACProfileEditButton' onClick={() => navigate('/perfil/editar')}>Editar perfil</button>
      </div>
      <div className='ACProfileAnimals'>
        <div className='ACProfileTitleBox'>
          <h1 className='ACProfileTitle'>Pets publicados</h1>
          <button className='ACProfileAddButton' onClick={() => openAnimalModal(true)}>
            <IconContext.Provider value={{color: "#FFFFFF", size:'20px'}}>
              <BiPlus />
            </IconContext.Provider>
          </button>
        </div>
        <div className='ACProfileAnimalsList'>
          {
            animals.map(animal => {
              const now = new Date();
              const birthDate = new Date(animal.birthDate);
              const age = Math.round((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
              const agePlural = age === 1 ? '' : 's';
              const months = Math.abs(now.getMonth() - birthDate.getMonth());
              const monthPlural = months === 1 ? 'mês' : 'meses';

              return <div className='ACProfileAnimalBox' key={animal._id}>
                <img src={animal.photos[0]} alt='Animal' className='ACProfileAnimalImage'/>
                <h2 className='ACProfileAnimalName'>{animal.name}</h2>
                <div className='ACProfileAnimalLabel'>
                  <p className='ACProfileAnimalKey'>Espécie:</p>
                  <p className='ACProfileAnimalValue'>{animal.species}</p>
                </div>
                <div className='ACProfileAnimalLabel'>
                  <p className='ACProfileAnimalKey'>Idade:</p>
                  <p className='ACProfileAnimalValue'>
                    {age > 0 ? `${age} ano${agePlural}` : `${months} ${monthPlural}`}
                  </p>
                </div>
                <div className='ACProfileAnimalPersonalities'>
                  {
                    animal.personality?.map(personality => {
                      return <div key={personality} className='ACProfileAnimalPersonality'>
                        <p>{personality}</p>
                      </div>
                    })
                  }
                </div>
                <button className='ACProfileAnimalButton' onClick={() => editAnimal(animal._id, true)}>Editar</button>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}