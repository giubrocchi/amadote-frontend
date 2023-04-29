import React, { useState, useEffect } from 'react';
import AdoptionCenterSignUp from './AdoptionCenterSignUp';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [userType, setUserType] = useState('adopter');
  const [adopterCheck, setAdopterCheck] = useState(true);
  const [adoptionCenterCheck, setAdoptionCenterCheck] = useState(false);
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
        <div>
          Adotante
        </div>
      }
      {(userType === 'adoptionCenter') &&
        <AdoptionCenterSignUp />
      }
    </div>
  );
}

export default SignUp;