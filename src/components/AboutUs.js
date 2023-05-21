import { React} from 'react';
import { ImTarget} from 'react-icons/im';
import { FaHandHoldingHeart} from 'react-icons/fa';
import { SlEyeglass} from 'react-icons/sl';
import { IoIosMail} from 'react-icons/io';
import { IconContext } from 'react-icons';

export default function AboutUs() {

  return (
    <div className='aboutBody'>
      <div className='aboutHeader'>
        <h1 className='aboutHeaderTitle'>Sobre o Amadote</h1>
        <img src='https://amadote.blob.core.windows.net/amadote/logo_amadote_laranja.png' className='aboutLogo' alt='Logo Amadote'/>
        <p className='aboutHeaderDescription'>O Amadote é uma plataforma de adoção responsável de animais que conecta ONGs de proteção animal e adotantes em potencial.</p>
        <h1 className='aboutUsTitle'>Sobre nós</h1>
        <div className='aboutUsHeader'>
          <div className='aboutUsCard'>
          <img src='https://amadote.blob.core.windows.net/amadote/Anita.png' className='aboutUs' alt='Logo Anita'/>
          <h3>Anita Gabionetta</h3>
          <p>UX Designer</p>
          </div>
          <div className='aboutUsCard'>
          <img src='https://amadote.blob.core.windows.net/amadote/Cicero.png' className='aboutUs' alt='Logo Anita'/>
          <h3>Cicero Cabral</h3>
          <p>Desenvolvedor</p>
          </div>
          <div className='aboutUsCard'>
          <img src='https://amadote.blob.core.windows.net/amadote/Giulia.png' className='aboutUs' alt='Logo Anita'/>
          <h3>Giulia Brocchi</h3>
          <p>Desenvolvedora FullStack</p>
          </div>
          <div className='aboutUsCard'>
          <img src='https://amadote.blob.core.windows.net/amadote/Nicole.png' className='aboutUs' alt='Logo Anita'/>
          <h3>Nicole Bertin</h3>
          <p>Analista de Negócio</p>
          </div>
        </div>
        <p className='aboutUsDescription'>Nós somos um grupo de estudantes apaixonados por animais e estamos comprometidos em ajudar ONGs e adotantes a encontrarem a melhor combinação para a adoção responsável de animais de estimação.<br/>Criamos esta plataforma para facilitar e tornar mais eficiente o processo de adoção, visando garantir o bem-estar dos animais e a satisfação dos adotantes.</p>
      </div>
      
      <div className='aboutSection'>
        <div className='aboutList'>
          <div className='aboutCard'>
            <IconContext.Provider value={{color: "#FFFFFF", size:'60px'}}>
              <ImTarget />
            </IconContext.Provider>
            <h2 className='aboutCardTitle'>Missão</h2>
            <p className='aboutCardDescription'>Conectar ONGs de proteção animal e adotantes em potencial para facilitar a adoção responsável de animais e ajudar a diminuir o número de animais em situação de abandono.</p>
          </div>
          <div className='aboutCard2'>
            <IconContext.Provider value={{color: "#1C3144", size:'60px'}}>
              <SlEyeglass />
            </IconContext.Provider>
            <h2 className='aboutCardTitle'>Visão</h2>
            <p className='aboutCardDescription'>Criar um mundo onde todos os animais possam viver felizes e saudáveis em lares amorosos e permanentes.</p>
          </div>
          <div className='aboutCard'>
            <IconContext.Provider value={{color: "#FFFFFF", size:'60px'}}>
              <FaHandHoldingHeart />
            </IconContext.Provider>
            <h2 className='aboutCardTitle'>Valores</h2>
            <p className='aboutCardDescription'>Bem-estar animal em primeiro lugar; Respeito e apoio às ONGs parceiras; Incentivo à adoção responsável; Transparência e honestidade; Inovação e melhoria contínua da plataforma.</p>
          </div>
        </div>
      </div>
      <div className='help'>
        <h1>Gostou da nossa iniciativa?</h1>
        <p>Para conseguirmos deixar o site no ar contamos com o apoio de nossa comunidade!<br/>
        Qualquer valor é bem-vindo e será utilizado para melhorar a plataforma e ajudar ainda mais os animais a encontrarem um lar.</p>
        <div className='helpCard'>
          <p>Nossa chave PIX é o nosso E-mail:</p>
          <div className='helpPix'>
            <IconContext.Provider value={{color: "#F9A03F", size:'25px'}}>
              <IoIosMail />
            </IconContext.Provider>
            <p>amadote@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
