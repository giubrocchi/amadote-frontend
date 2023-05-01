import React, { useState, useEffect } from 'react';
import AdopterSignIn from './AdopterSignIn';
import AdoptionCenterSignIn from './AdoptionCenterSignIn';
import { useNavigate, useLocation } from 'react-router-dom';

function SignIn() {
  const location = useLocation();
  const path = location?.state?.path ?? 'adopter';
  const [userType, setUserType] = useState(path);
  const [adopterCheck, setAdopterCheck] = useState(path === 'adopter');
  const [adoptionCenterCheck, setAdoptionCenterCheck] = useState(path === 'adoptionCenter');
  const navigate = useNavigate();

  function handleRadioClick(user){
    setUserType(user);
    setAdoptionCenterCheck(!adoptionCenterCheck);
    setAdopterCheck(!adopterCheck);
  }

  useEffect(() => {
    if(localStorage.getItem('loggedId')) navigate('/perfil');
  }, [navigate]);

  return (
    <div className='signUpBody'>
      <h1 style={{marginTop: '50px'}}>Entrar</h1>
      <div className='signUpUser'>
        <div className='signUpSelect' onClick={() => handleRadioClick('adopter')}>
          <input type='radio' value='Adopter' name='useType' checked={adopterCheck} readOnly/>
          <p>Sou pessoa física</p>
        </div>
        <div className='signUpSelect' onClick={() => handleRadioClick('adoptionCenter')}>
          <input type='radio' value='AdoptionCenter' name='useType' checked={adoptionCenterCheck} readOnly/>
        <p>Sou ONG</p>
        </div>
      </div>
      {(userType === 'adopter') &&
        <AdopterSignIn />
      }
      {(userType === 'adoptionCenter') &&
        <AdoptionCenterSignIn />
      }
    </div>
  );
}

export default SignIn;