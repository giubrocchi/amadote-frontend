import React, { useState, useEffect } from 'react';
import AdoptionCenterSignUp from './AdoptionCenterSignUp';
import AdopterSignUp from './AdopterSignUp';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { IconContext } from 'react-icons';

function SignUp() {
  const location = useLocation();
  const path = location?.state?.path ?? 'adopter';
  const [userType, setUserType] = useState(path);
  const [adopterCheck, setAdopterCheck] = useState(path === 'adopter');
  const [adoptionCenterCheck, setAdoptionCenterCheck] = useState(path === 'adoptionCenter');
  const navigate = useNavigate();

  function handleRadioClick(user) {
    if (user === userType) return;

    setUserType(user);
    setAdoptionCenterCheck(!adoptionCenterCheck);
    setAdopterCheck(!adopterCheck);
  }

  useEffect(() => {
    if (localStorage.getItem('loggedId')) navigate('/perfil');
  }, [navigate]);

  return (
    <div className="signUpBody">
      <div className="signUpTitle">
        <h1>Se junte a gente!</h1>
        <IconContext.Provider value={{ color: '#1C3144', size: '28px' }}>
          <FaPaw style={{ transform: 'rotate(-24deg)', margin: '0px 6px' }} />
        </IconContext.Provider>
        <IconContext.Provider value={{ color: '#F9A03F', size: '28px' }}>
          <FaPaw style={{ transform: 'rotate(-24deg)', margin: '0px 6px' }} />
        </IconContext.Provider>
      </div>
      <div className="signUpUser">
        <div className="signUpSelect" onClick={() => handleRadioClick('adopter')}>
          <div className="signUpContainer">
            <input
              type="checkbox"
              className="checkbox"
              value="Adopter"
              name="useType"
              checked={adopterCheck}
              readOnly
            />
            <p className="signUpPersonType">Sou pessoa física</p>
          </div>
          <label className="signUpSubTitle">Quero adotar um animal</label>
        </div>
        <div className="signUpSelect" onClick={() => handleRadioClick('adoptionCenter')}>
          <div className="signUpContainer">
            <input
              type="checkbox"
              className="checkbox"
              value="AdoptionCenter"
              name="useType"
              checked={adoptionCenterCheck}
              readOnly
            />
            <p className="signUpPersonType">Sou ONG</p>
          </div>
          <label className="signUpSubTitle">
            Quero divulgar um animal e ter controle das adoções
          </label>
        </div>
      </div>
      {userType === 'adopter' && <AdopterSignUp />}
      {userType === 'adoptionCenter' && <AdoptionCenterSignUp />}
    </div>
  );
}

export default SignUp;
