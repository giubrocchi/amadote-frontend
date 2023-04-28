import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({path}) {
  const navigate = useNavigate();

  function handleButtonClick(tabName){
    navigate(`/${tabName}`);
  }

  return (
    <div className='headerBody'>
      <div className='headerTop'>
        <h1 className='headerAmadote'>AmaDote</h1>
      </div>
      <div className='headerBottom'>
        <button className={'headerTab ' + (path === 'inicio')} onClick={() => handleButtonClick('')}>
          <h2 className='headerTabName'>Início</h2>
        </button>
        <button className={'headerTab ' + (path === 'animais')} onClick={() => handleButtonClick('animais')}>
          <h2 className='headerTabName'>Animais disponíveis</h2>
        </button>
        <button className={'headerTab ' + (path === 'postagens')} onClick={() => handleButtonClick('postagens')}>
          <h2 className='headerTabName'>Postagens</h2>
        </button>
        <button className={'headerTab ' + (path === 'faq')} onClick={() => handleButtonClick('faq')}>
          <h2 className='headerTabName'>Perguntas frequentes</h2>
        </button>
        <button className={'headerTab ' + (path === 'institucional')} onClick={() => handleButtonClick('institucional')}>
          <h2 className='headerTabName'>Institucional</h2>
        </button>
        <button className={'headerTab ' + (path === 'entrar')} onClick={() => handleButtonClick('entrar')}>
          <h2 className='headerTabName'>Cadastrar/Entrar</h2>
        </button>
      </div>
    </div>
  )
}
