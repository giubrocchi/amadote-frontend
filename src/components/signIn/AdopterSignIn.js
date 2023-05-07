import React, { useState } from 'react';
import './AdopterSignIn.css';
import toast, { Toaster } from 'react-hot-toast';
import { apiBaseUrl } from '../utils/links';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

function AdopterSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const response = await fetch(`${apiBaseUrl}/api/adopter/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const jsonResponse = await response.json() ?? {};
    
    setLoading(false);

    if(response.status === 500){
      showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
      return;
    }

    if(!jsonResponse.login){
      setAlert(true);
      return;
    }

    if(jsonResponse.login){
      localStorage.setItem('loggedId', jsonResponse.id);
      navigate('/');
      return;
    }
  };

  function showErrorAlert(message){
    toast.error(message);
  }

  return (
    <div className='formBody'>
      <form className='signUpForm' onSubmit={handleSubmit}>
        <p style={{visibility: alert ? 'visible' : 'hidden', color: 'red'}}>E-mail ou senha incorretos!</p>
        <input type="email" className='signUpInput' required id='email' value={email} placeholder='E-mail*' onChange={handleEmailChange} />
        <input type="password" className='signUpInput' required id='password' value={password} placeholder='Senha*' onChange={handlePasswordChange} />
        <button type="submit" className='signUpButton'>
          {!loading && 'Entrar'}
          {loading && <ThreeDots height='21' radius='9' color="#1C3144" ariaLabel="three-dots-loading"/>}
        </button>
      </form>
      <div className='signInBox'>
        <h3 className='signInText'>Ainda não tem uma conta? </h3>
        <h3 className='signInTextButton' onClick={() => navigate('/cadastrar', {state: {path: 'adopter'}})}>Cadastrar</h3>
      </div>
      <Toaster/>
    </div>
  );
}

export default AdopterSignIn;