import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { apiBaseUrl } from '../utils/links';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

function AdoptionCenterSignUp() {
  const [registrationDocument, setPdfFile] = useState(null);
  const [corporateName, setCorporateName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [CNPJ, setCNPJ] = useState('');
  const [streetName, setStreetName] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [invalidTelephone, setInvalidTelephone] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidCnpj, setInvalidCnpj] = useState(false);
  const [invalidZipCode, setInvalidZipCode] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleCorporateNameChange = (event) => {
    setCorporateName(event.target.value);
  };

  const handleTelephoneChange = (event) => {
    setInvalidTelephone(false);
    setTelephone(phoneMask(event.target.value));
  };

  const phoneMask = (phone) => {
    return phone.replace(/\D/g,'')
      .replace(/(\d{2})(\d)/,"($1) $2")
      .replace(/(\d)(\d{4})$/,"$1-$2");
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  
  const handlePasswordChange = (event) => {
    setInvalidPassword(false);
    setPassword(event.target.value);
  };
  
  const handleCNPJChange = (event) => {
    setInvalidCnpj(false);
    setCNPJ(cnpjMask(event.target.value));
  };

  const cnpjMask = (cnpj) => {
    return cnpj
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
  
  const handleStreetNameChange = (event) => {
    setStreetName(event.target.value);
  };
  
  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };
  
  const handleComplementChange = (event) => {
    setComplement(event.target.value);
  };
  
  const handleZipCodeChange = async (event) => {
    const zipCode = event.target.value;

    setZipCode(zipCodeMask(zipCode));
    setInvalidZipCode(false);

    if(zipCode.length >= 8){
      const zipCodeInfo = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`, { mode: 'cors' });

      if(zipCodeInfo.ok){
        const jsonZipCodeInfo = await zipCodeInfo.json() ?? {};

        setStreetName(jsonZipCodeInfo.logradouro);
        setDistrict(jsonZipCodeInfo.bairro);
        setCity(jsonZipCodeInfo.localidade);
        setState(jsonZipCodeInfo.uf);
      }
    }
  };

  const zipCodeMask = (zipCode) => {
    return zipCode.replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  }
  
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  
  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const noMaskTelephone = telephone.replace(/\D/g, '');
    const noMaskCnpj = CNPJ.replace(/\D/g, '');
    const noMaskZipCode = zipCode.replace(/\D/g, '');
    let invalid = false;

    if(noMaskTelephone.length < 8) {
      setInvalidTelephone(true);
      invalid = true;
    }

    if(!isValidPassword(password)) {
      setInvalidPassword(true);
      invalid = true;
    }

    if(noMaskCnpj.length < 14) {
      setInvalidCnpj(true);
      invalid = true;
    }

    if(noMaskZipCode.length < 8) {
      setInvalidZipCode(true);
      invalid = true;
    }

    if(invalid) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setLoading(true);

      const pdfBase64 = reader.result.replace('data:', '').replace(/^.+,/, '');
      const response = await fetch(`${apiBaseUrl}/api/adoptionCenter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          corporateName,
          telephone: noMaskTelephone,
          email,
          password,
          CNPJ: noMaskCnpj,
          registrationDocument: pdfBase64,
          streetName,
          number,
          complement,
          zipCode: noMaskZipCode,
          city,
          state,
          district
        }),
      });

      setLoading(false);

      if(response.status === 400) showErrorAlert('Preencha todos os campos corretamente.');
      else if(response.status === 401) showErrorAlert('E-mail já cadastrado!');
      else if(response.status === 500) showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
      else{
        toast.success('Sua solicitação de cadastro foi realizada com sucesso!', {duration: 5000});
        event.target.reset();
        setCorporateName('');
        setTelephone('');
        setEmail('');
        setPassword('');
        setCNPJ('');
        setStreetName('');
        setNumber('');
        setComplement('');
        setZipCode('');
        setCity('');
        setState('');
        setDistrict('');
      }
    }
    reader.readAsDataURL(registrationDocument);
  };

  function isValidPassword(password){
    const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$/;

    return validPasswordRegex.test(password);
  }

  function showErrorAlert(message){
    toast.error(message);
  }

  return (
    <div className='formBody'>
      <form className='signUpForm' onSubmit={handleSubmit}>
        <input type="text" maxLength="250" className='signUpInput' required id='corporateName' value={corporateName} placeholder='Razão social*' onChange={handleCorporateNameChange} />
        <input type="tel" maxLength="15" className={`signUpInput invalid${invalidTelephone}`} required id='telephone' value={telephone} placeholder='Telefone*' onChange={handleTelephoneChange} />
        <input type="email" maxLength="250" className='signUpInput' required id='email' value={email} placeholder='E-mail*' onChange={handleEmailChange} />
        <input type="text" className={`signUpInput invalid${invalidCnpj}`} required id='CNPJ' value={CNPJ} placeholder='CNPJ*' onChange={handleCNPJChange} />
        <input type="text" className={`signUpInput invalid${invalidZipCode}`} required id='zipCode' value={zipCode} placeholder='CEP*' onChange={handleZipCodeChange} />
        <input type="text" maxLength="250" className='signUpInput' required id='streetName' value={streetName} placeholder='Rua*' onChange={handleStreetNameChange} />
        <input type="text" maxLength="20" className='signUpInput' required id='number' value={number} placeholder='Número*' onChange={handleNumberChange} />
        <input type="text" maxLength="250" className='signUpInput' id='complement' value={complement} placeholder='Complemento' onChange={handleComplementChange} />
        <input type="text" maxLength="250" className='signUpInput' required id='city' value={city} placeholder='Cidade*' onChange={handleCityChange} />
        <input type="text" maxLength="2" className='signUpInput' required id='state' value={state} placeholder='UF*' onChange={handleStateChange} />
        <input type="text" maxLength="250" className='signUpInput' required id='district' value={district} placeholder='Bairro*' onChange={handleDistrictChange} />
        <div style={{display: invalidPassword ? 'unset' : 'none', color: 'red'}}>
          <p>Uma senha deve conter no mínimo 8 caracteres sendo eles:</p>
          <ul>
            <li>Pelo menos uma letra;</li>
            <li>Pelo menos um caracter especial;</li>
            <li>Pelo menos uma letra maiúscula.</li>
          </ul>
        </div>
        <input type="password" maxLength="250" className={`signUpInput invalid${invalidPassword}`} required id='password' value={password} placeholder='Senha*' onChange={handlePasswordChange} />
        <p className='signUpInputLabel'>Documento de registro (PDF)*</p>
        <input type="file" className='signUpFile' required accept=".pdf" onChange={handleFileChange} />
        <button type="submit" className='signUpButton'>
          {!loading && 'Solicitar cadastro'}
          {loading && <ThreeDots height='21' radius='9' color="#1C3144" ariaLabel="three-dots-loading"/>}
        </button>
      </form>
      <div className='signInBox'>
        <h3 className='signInText'>Já possui uma conta? </h3>
        <h3 className='signInTextButton' onClick={() => navigate('/entrar', {state: {path: 'adoptionCenter'}})}>Entrar</h3>
      </div>
      <Toaster/>
    </div>
  );
}

export default AdoptionCenterSignUp;