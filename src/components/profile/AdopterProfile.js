import { React } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

export default function AdoptionCenterProfile({ adopterName }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('loggedId');
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
        <div className="ACProfileAnimalsList"></div>
      </div>
    </div>
  );
}
