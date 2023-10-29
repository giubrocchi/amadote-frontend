import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import { IconContext } from 'react-icons';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="footerBody">
      <div className="footerColumn" id="footerLogoColumn">
        <img
          src="https://amadote.blob.core.windows.net/amadote/logo_amadote_laranja.png"
          className="footerLogo"
          alt="Logo Amadote"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <IconContext.Provider value={{ color: '#F9A03F', size: '20px' }}>
            <AiOutlineCopyrightCircle />
          </IconContext.Provider>
          <p style={{ color: '#FFF', margin: 0, fontSize: 12 }}>Copyright</p>
        </div>
      </div>
      <div className="footerColumn">
        <p className="footerCategory footerHeader" onClick={() => navigate('/')}>
          Inicio
        </p>
        <p className="footerCategory" onClick={() => navigate('/animais')}>
          Animais disponiveis
        </p>
        <p className="footerCategory" onClick={() => navigate('/postagens')}>
          Postagens
        </p>
      </div>
      <div className="footerColumn">
        <p className="footerCategory footerHeader" onClick={() => navigate('/institucional')}>
          Sobre nós
        </p>
        <p className="footerCategory" onClick={() => navigate('/institucional')}>
          Institucional
        </p>
        <p className="footerCategory">FAQ</p>
      </div>
      <div className="footerColumn">
        <p className="footerCategory footerHeader" onClick={() => navigate('/perfil')}>
          Perfil
        </p>
        <p className="footerCategory" onClick={() => navigate('/cadastrar')}>
          Cadastre-se
        </p>
        <p className="footerCategory" onClick={() => navigate('/entrar')}>
          Entrar
        </p>
        <p className="footerCategory">Mensagens</p>
        <p className="footerCategory">Animais favoritados</p>
      </div>
    </div>
  );
}
