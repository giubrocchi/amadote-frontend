import React, { useState } from 'react';
import './AdoptionCenterSignUp.css';
import toast, { Toaster } from 'react-hot-toast';

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

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleCorporateNameChange = (event) => {
    setCorporateName(event.target.value);
  };

  const handleTelephoneChange = (event) => {
    setTelephone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  
  const handleCNPJChange = (event) => {
    setCNPJ(event.target.value);
  };
  
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

    setZipCode(zipCode);

    const zipCodeInfo = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`, { mode: 'cors' });
    const jsonZipCodeInfo = await zipCodeInfo.json();

    if(zipCodeInfo.status === 200){
      setStreetName(jsonZipCodeInfo.logradouro);
      setDistrict(jsonZipCodeInfo.bairro);
      setCity(jsonZipCodeInfo.localidade);
      setState(jsonZipCodeInfo.uf);
    }
  };
  
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

    const reader = new FileReader();
    reader.onloadend = async () => {
      const pdfBase64 = reader.result.replace('data:', '').replace(/^.+,/, '');

      const response = await fetch('https://amadote-api.azurewebsites.net/api/adoptionCenter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          corporateName,
          telephone,
          email,
          password,
          CNPJ,
          registrationDocument: pdfBase64,
          streetName,
          number,
          complement,
          zipCode,
          city,
          state,
          district
        }),
      });

      if(response.status === 400) showErrorAlert('Preencha todos os campos corretamente.');
      else if(response.status === 401) showErrorAlert('E-mail já cadastrado!');
      else if(response.status !== 202) showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
    }
    reader.readAsDataURL(registrationDocument);
  };

  function showErrorAlert(message){
    toast.error(message);
  }

  return (
    <div>
      <form className='signUpForm' onSubmit={handleSubmit}>
        <input type="text" className='signUpInput' required id='corporateName' value={corporateName} placeholder='Razão social*' onChange={handleCorporateNameChange} />
        <input type="text" className='signUpInput' required id='telephone' value={telephone} placeholder='Telefone*' onChange={handleTelephoneChange} />
        <input type="email" className='signUpInput' required id='email' value={email} placeholder='E-mail*' onChange={handleEmailChange} />
        <input type="text" className='signUpInput' required id='CNPJ' value={CNPJ} placeholder='CNPJ*' onChange={handleCNPJChange} />
        <input type="text" className='signUpInput' required id='zipCode' value={zipCode} placeholder='CEP*' onChange={handleZipCodeChange} />
        <input type="text" className='signUpInput' required id='streetName' value={streetName} placeholder='Rua*' onChange={handleStreetNameChange} />
        <input type="text" className='signUpInput' required id='number' value={number} placeholder='Número*' onChange={handleNumberChange} />
        <input type="text" className='signUpInput' id='complement' value={complement} placeholder='Complemento' onChange={handleComplementChange} />
        <input type="text" className='signUpInput' required id='city' value={city} placeholder='Cidade*' onChange={handleCityChange} />
        <input type="text" className='signUpInput' required id='state' value={state} placeholder='UF*' onChange={handleStateChange} />
        <input type="text" className='signUpInput' required id='district' value={district} placeholder='Bairro*' onChange={handleDistrictChange} />
        <input type="password" className='signUpInput' required id='password' value={password} placeholder='Senha*' onChange={handlePasswordChange} />
        <input type="file" className='signUpFile' required accept=".pdf" onChange={handleFileChange} />
        <button type="submit" className='signUpButton'>Solicitar cadastro</button>
      </form>
      <Toaster/>
    </div>
  );
}

export default AdoptionCenterSignUp;