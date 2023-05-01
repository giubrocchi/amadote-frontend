import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { AiOutlineUser, AiOutlineHeart, AiOutlineMail, AiOutlineMenu } from 'react-icons/ai';
import { IconContext } from 'react-icons';

export default function Header({path}) {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [isSideBarOpen, setSideBarOpen] = useState(false);

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
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  function handleButtonClick(tabName){
    setSideBarOpen(false);
    navigate(`/${tabName}`);
  }

  function toggleModal(){
    setSideBarOpen(!isSideBarOpen);
  }

  return (
    <>
      {windowSize.innerWidth < 800 &&
        <div className='headerBody'>
          <div className='headerTopMobile'>
            <h1 className='headerAmadote'>AmaDote</h1>
            <button className='headerIcon' onClick={() => toggleModal()}>
              <IconContext.Provider value={{color: "white", size:'28px'}}>
                <AiOutlineMenu />
              </IconContext.Provider>
            </button>
          </div>
          <div className='sidebar' style={{visibility: isSideBarOpen ? 'visible' : 'hidden'}}>
            <div className='headerTopMobile'>
              <h1 className='headerAmadote'>AmaDote</h1>
              <button className='headerIcon' onClick={() => toggleModal()}>
                <IconContext.Provider value={{color: "black", size:'28px'}}>
                  <AiOutlineMenu />
                </IconContext.Provider>
              </button>
            </div>
            <div className='headerBottomMobile'>
              <div>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('')}>
                  <h2 className='headerTabName'>Início</h2>
                </button>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('animais')}>
                  <h2 className='headerTabName'>Animais disponíveis</h2>
                </button>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('postagens')}>
                  <h2 className='headerTabName'>Postagens</h2>
                </button>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('faq')}>
                  <h2 className='headerTabName'>Perguntas frequentes</h2>
                </button>
                <button className={'headerTabMobile'} onClick={() => handleButtonClick('institucional')}>
                  <h2 className='headerTabName'>Institucional</h2>
                </button>
              </div>
              <div className='iconTabMobile'>
                <button className='headerIconMobile' onClick={() => handleButtonClick('favoritos')}>
                  <IconContext.Provider value={{color: "black", size:'28px'}}>
                    <AiOutlineHeart />
                  </IconContext.Provider>
                </button>
                <button className='headerIconMobile' onClick={() => handleButtonClick('mensagens')}>
                  <IconContext.Provider value={{color: "black", size:'28px'}}>
                    <AiOutlineMail />
                  </IconContext.Provider>
                </button>
                <button className='headerIconMobile' onClick={() => handleButtonClick('entrar')}>
                  <IconContext.Provider value={{color: "black", size:'28px'}}>
                    <AiOutlineUser />
                  </IconContext.Provider>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {windowSize.innerWidth >= 800 &&
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
            <div className='headerTab iconTab'>
              <button className='headerIcon' onClick={() => handleButtonClick('favoritos')}>
                <IconContext.Provider value={{color: "white", size:'28px'}}>
                  <AiOutlineHeart />
                </IconContext.Provider>
              </button>
              <button className='headerIcon' onClick={() => handleButtonClick('mensagens')}>
                <IconContext.Provider value={{color: "white", size:'28px'}}>
                  <AiOutlineMail />
                </IconContext.Provider>
              </button>
              <button className='headerIcon' onClick={() => handleButtonClick('entrar')}>
                <IconContext.Provider value={{color: "white", size:'28px'}}>
                  <AiOutlineUser />
                </IconContext.Provider>
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}
