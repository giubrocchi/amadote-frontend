import { React, useState, useEffect } from 'react';
import { BiPlus, BiLogOut } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import CreateAnimalModal from './CreateAnimalModal';
import EditAnimalModal from './EditAnimalModal';
import { apiBaseUrl } from '../utils/links';
import { useNavigate } from 'react-router-dom';
import AnimalCard from '../utils/AnimalCard';

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
            <IconContext.Provider value={{color: "#1C3144", size:'30px', cursor: 'pointer'}}>
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
              return <AnimalCard 
                animalInfo={animal}
                key={animal._id}
                buttonOptions={{ buttonText: 'Editar', buttonFunction: () => editAnimal(animal._id, true) }}
              />
            })
          }
        </div>
      </div>
    </div>
  )
}