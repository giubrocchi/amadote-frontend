import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <div className='footerBody'>
      <div className='footerColumn'>
        <p className='footerCategory footerHeader'>Inicio</p>
        <p className='footerCategory'>Animais disponiveis</p>
        <p className='footerCategory'>Postagens</p>
      </div>
      <div className='footerColumn'>
        <p className='footerCategory footerHeader'>Sobre nós</p>
        <p className='footerCategory'>Apoie-nos</p>
        <p className='footerCategory'>FAQ</p>
      </div>
      <div className='footerColumn'>
        <p className='footerCategory footerHeader'>Perfil</p>
        <p className='footerCategory'>Cadastrar-se</p>
        <p className='footerCategory'>Entrar</p>
        <p className='footerCategory'>Mensagens</p>
        <p className='footerCategory'>Animais favoritados</p>
      </div>
    </div>
  )
}