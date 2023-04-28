import React, { useState } from 'react';
import AdopterSignIn from './AdopterSignIn';
import './SignIn.css';

function SignIn() {
  const [userType, setUserType] = useState('adopter');
  const [adopterCheck, setAdopterCheck] = useState(true);
  const [adoptionCenterCheck, setAdoptionCenterCheck] = useState(false);

  function handleRadioClick(user){
    setUserType(user);
    setAdoptionCenterCheck(!adoptionCenterCheck);
    setAdopterCheck(!adopterCheck);
  }

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
          <AdopterSignIn />
        </div>
      }
      {(userType === 'adoptionCenter') &&
        <div>
          Centro de adoção
        </div>
      }
    </div>
  );
}

export default SignIn;