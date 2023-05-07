import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { apiBaseUrl } from '../utils/links';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

function AdopterSignUp() {
  const [fullName, setFullName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [invalidTelephone, setInvalidTelephone] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const navigate = useNavigate();

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleTelephoneChange = (event) => {
    setInvalidTelephone(false);
    setTelephone(phoneMask(event.target.value));
  };

  const phoneMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  
  const handlePasswordChange = (event) => {
    setInvalidPassword(false);
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const noMaskTelephone = telephone.replace(/\D/g, '');
    let invalid = false;

    if(noMaskTelephone.length < 8) {
      setInvalidTelephone(true);
      invalid = true;
    }

    if(!isValidPassword(password)) {
      setInvalidPassword(true);
      invalid = true;
    }

    if(invalid) return;

    setLoading(true);

    const response = await fetch(`${apiBaseUrl}/api/adopter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName,
        telephone: noMaskTelephone,
        email,
        password
      }),
    });

    setLoading(false);

    if(response.status === 400) showErrorAlert('Preencha todos os campos corretamente.');
    else if(response.status === 401) showErrorAlert('E-mail já cadastrado!');
    else if(response.status === 500) showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else setSignedUp(true);
  }

  function isValidPassword(password){
    const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$/;

    return validPasswordRegex.test(password);
  }

  function showErrorAlert(message){
    toast.error(message);
  }

  return (
    <div className='formBody'>
      {!signedUp &&
        <>
          <form className='signUpForm' onSubmit={handleSubmit}>
            <input type="text" maxLength="250" className='signUpInput' required id='fullName' value={fullName} placeholder='Nome completo*' onChange={handleFullNameChange} />
            <input type="tel" maxLength="15" className={`signUpInput invalid${invalidTelephone}`} required id='telephone' value={telephone} placeholder='Telefone*' onChange={handleTelephoneChange} />
            <input type="email" maxLength="250" className='signUpInput' required id='email' value={email} placeholder='E-mail*' onChange={handleEmailChange} />
            <div style={{display: invalidPassword ? 'unset' : 'none', color: 'red'}}>
              <p>Uma senha deve conter no mínimo 8 caracteres sendo eles:</p>
              <ul>
                <li>Pelo menos uma letra;</li>
                <li>Pelo menos um caracter especial;</li>
                <li>Pelo menos uma letra maiúscula.</li>
              </ul>
            </div>
            <input type="password" maxLength="250" className={`signUpInput invalid${invalidPassword}`} required id='password' value={password} placeholder='Senha*' onChange={handlePasswordChange} />
            <button type="submit" className='signUpButton'>
              {!loading && 'Cadastrar'}
              {loading && <ThreeDots height='21' radius='9' color="#1C3144" ariaLabel="three-dots-loading"/>}
            </button>
          </form>
          <div className='signInBox'>
            <h3 className='signInText'>Já possui uma conta? </h3>
            <h3 className='signInTextButton' onClick={() => navigate('/entrar', {state: {path: 'adopter'}})}>Entrar</h3>
          </div>
        </>
      }
      {signedUp &&
        <div style={{textAlign: 'center'}}>
          <h1>Cadastro realizado com sucesso!</h1>
          <h2 style={{textDecoration: 'underline', display: 'inline'}} onClick={() => navigate('/entrar', {state: {path: 'adopter'}})}>Entre</h2>
          <h2 style={{display: 'inline'}}> com a sua conta.</h2>
        </div>
      }
      <Toaster/>
    </div>
  );
}

export default AdopterSignUp;