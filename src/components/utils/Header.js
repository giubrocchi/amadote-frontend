import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineUser, AiOutlineMenu } from 'react-icons/ai';
import { IconContext } from 'react-icons';

export default function Header({ path }) {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  function handleButtonClick(tabName) {
    setSideBarOpen(false);
    navigate(`/${tabName}`);
  }

  function toggleModal() {
    setSideBarOpen(!isSideBarOpen);
  }

  return (
    <>
      {windowSize.innerWidth < 800 && (
        <div className="headerBody">
          <div className="headerTopMobile">
            <div className="headerLogoBox" onClick={() => navigate('/')}>
              <img
                src="https://amadote.blob.core.windows.net/amadote/LogoNova.png"
                className="headerLogo"
                alt="Logo Amadote"
              />
            </div>
            <button className="headerIcon" onClick={() => toggleModal()}>
              <IconContext.Provider value={{ color: 'white', size: '28px' }}>
                <AiOutlineMenu />
              </IconContext.Provider>
            </button>
          </div>
          <div
            className="modalOverlay"
            style={{ visibility: isSideBarOpen ? 'visible' : 'hidden' }}
            onClick={() => toggleModal()}
          >
            <div className="sidebar" onClick={(e) => e.stopPropagation()}>
              <div className="headerTopMobile">
                <h1 className="headerAmadoteMobile">Amadote</h1>
                <button className="headerIcon" onClick={() => toggleModal()}>
                  <IconContext.Provider value={{ color: 'black', size: '28px' }}>
                    <AiOutlineMenu />
                  </IconContext.Provider>
                </button>
              </div>
              <div className="headerBottomMobile">
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('')}>
                  <h2 className="headerTabName">Início</h2>
                </button>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('animais')}>
                  <h2 className="headerTabName">Animais disponíveis</h2>
                </button>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('ongs')}>
                  <h2 className="headerTabName">ONGs cadastradas</h2>
                </button>
                <button
                  className={'headerTabMobile'}
                  onClick={() => handleButtonClick('postagens')}
                >
                  <h2 className="headerTabName">Postagens</h2>
                </button>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('faq')}>
                  <h2 className="headerTabName">Perguntas frequentes</h2>
                </button>
                <button
                  className={'headerTabMobile'}
                  onClick={() => handleButtonClick('institucional')}
                >
                  <h2 className="headerTabName">Institucional</h2>
                </button>
                <button className="headerTabMobile" onClick={() => handleButtonClick('entrar')}>
                  <h2 className="headerTabName">Meu perfil</h2>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {windowSize.innerWidth >= 800 && (
        <div className="headerBody">
          <div className="headerTop">
            <div className="headerLogoBox" onClick={() => navigate('/')}>
              <img
                src="https://amadote.blob.core.windows.net/amadote/LogoNova.png"
                className="headerLogo"
                alt="Logo Amadote"
              />
            </div>
          </div>
          <div className="headerBottom">
            <button
              className={'headerTab ' + (path === 'inicio')}
              onClick={() => handleButtonClick('')}
            >
              <h2 className="headerTabName">Início</h2>
            </button>
            <button
              className={'headerTab ' + (path === 'animais')}
              onClick={() => handleButtonClick('animais')}
            >
              <h2 className="headerTabName">Animais disponíveis</h2>
            </button>
            <button
              className={'headerTab ' + (path === 'ongs')}
              onClick={() => handleButtonClick('ongs')}
            >
              <h2 className="headerTabName">ONGs cadastradas</h2>
            </button>
            <button
              className={'headerTab ' + (path === 'postagens')}
              onClick={() => handleButtonClick('postagens')}
            >
              <h2 className="headerTabName">Postagens</h2>
            </button>
            <button
              className={'headerTab ' + (path === 'faq')}
              onClick={() => handleButtonClick('faq')}
            >
              <h2 className="headerTabName">Perguntas frequentes</h2>
            </button>
            <button
              className={'headerTab ' + (path === 'institucional')}
              onClick={() => handleButtonClick('institucional')}
            >
              <h2 className="headerTabName">Institucional</h2>
            </button>
            <div className="headerTab iconTab">
              <button className="headerIcon" onClick={() => handleButtonClick('cadastrar')}>
                Cadastro
              </button>
              <button className="headerIcon" onClick={() => handleButtonClick('entrar')}>
                Entrar
              </button>
              {/* 
                  <IconContext.Provider
                    value={{
                      color: path === 'entrar' ? '#F9A03F' : 'white',
                      size: '28px',
                    }}
                  >
                    <AiOutlineUser />
                  </IconContext.Provider>
              */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
