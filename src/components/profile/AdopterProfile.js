import { React } from 'react';
import { BiLogOut } from 'react-icons/bi';
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
      <div className="ACProfileAnimals">
        <div className="ACProfileTitleBox">
          <h1 className="ACProfileTitle">Pets favoritados</h1>
        </div>
        <div className="ACProfileAnimalsList"></div>
      </div>
    </div>
  );
}
