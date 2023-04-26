import React, { useState } from 'react';
import AdoptionCenterSignUp from './AdoptionCenterSignUp';
import './SignUp.css';

function SignUp() {
  const [userType, setUserType] = useState('adopter');

  return (
    <div className='signUpBody'>
      <div className='signUpUser'>
        <div className='signUpSelect'>
          <input type='radio' value='Adopter' name='useType' defaultChecked onClick={() => setUserType('adopter')}/>
          <p>Sou pessoa física</p>
        </div>
        <div className='signUpSelect'>
          <input type='radio' value='AdoptionCenter' name='useType' onClick={() => setUserType('adoptionCenter')}/>
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