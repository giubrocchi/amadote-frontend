import React from 'react';

export default function Footer() {
  return (
    <div className='footerBody'>
      <div className='footerColumn'>
        <p className='footerCategory footerHeader'>Inicio</p> 
        <p className='footerCategory'><a href='/animais' style={{textDecoration: 'none', color: 'inherit'}}>Animais disponiveis</a></p>
        <p className='footerCategory'><a href='/postagens' style={{textDecoration: 'none', color: 'inherit'}}>Postagens</a></p>
      </div>
      <div className='footerColumn'>
        <p className='footerCategory footerHeader'>Sobre nós</p>
        <p className='footerCategory'><a href='/institucional' style={{textDecoration: 'none', color: 'inherit'}}>Institucional</a></p>
        <p className='footerCategory'>FAQ</p>
      </div>
      <div className='footerColumn'>
        <p className='footerCategory footerHeader'>Perfil</p>
        <p className='footerCategory'><a href='/cadastrar' style={{textDecoration: 'none', color: 'inherit'}}>Cadastre-se</a></p>
        <p className='footerCategory'><a href='/entrar' style={{textDecoration: 'none', color: 'inherit'}}>Entrar</a></p>
        <p className='footerCategory'>Mensagens</p>
        <p className='footerCategory'>Animais favoritados</p>
      </div>
    </div>
  )
}