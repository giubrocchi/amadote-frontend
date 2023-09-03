import { React, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { apiBaseUrl } from '../utils/links';

export default function UserInformationModal(props) {
  const { user, setUserInformationModalOpen, setAdoptionInformationModalOpen } = props;
  const [cpf, setCpf] = useState(cpfMask(user.CPF));
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [streetName, setStreetName] = useState(user.address?.streetName);
  const [number, setNumber] = useState(user.address?.number);
  const [complement, setComplement] = useState(user.address?.complement);
  const [zipCode, setZipCode] = useState(zipCodeMask(user.address?.zipCode));
  const [city, setCity] = useState(user.address?.city);
  const [state, setState] = useState(user.address?.state);
  const [district, setDistrict] = useState(user.address?.district);

  const [invalidZipCode, setInvalidZipCode] = useState(false);
  const [invalidCpf, setInvalidCpf] = useState(false);
  const [invalidState, setInvalidState] = useState(false);

  const [loading, setLoading] = useState(false);

  function cpfMask(cpf) {
    return cpf
      ?.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }

  const handleCpfChange = (event) => {
    setCpf(cpfMask(event.target.value));
  };

  function isValidCpf(CPF) {
    if (!CPF) return false;

    if (
      CPF.length !== 11 ||
      CPF === '00000000000' ||
      CPF === '11111111111' ||
      CPF === '22222222222' ||
      CPF === '33333333333' ||
      CPF === '44444444444' ||
      CPF === '55555555555' ||
      CPF === '66666666666' ||
      CPF === '77777777777' ||
      CPF === '88888888888' ||
      CPF === '99999999999'
    )
      return false;

    let add = 0;
    let i = 0;
    let rev = 0;
    for (i = 0; i < 9; i++) add += parseInt(CPF.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(CPF.charAt(9))) return false;

    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(CPF.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(CPF.charAt(10))) return false;

    return true;
  }

  const handleBirthDateChange = (event) => {
    setBirthDate(event.target.value);
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

    setZipCode(zipCodeMask(zipCode));
    setInvalidZipCode(false);

    if (zipCode.length >= 8) {
      const zipCodeInfo = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`, {
        mode: 'cors',
      });

      if (zipCodeInfo.ok) {
        const jsonZipCodeInfo = (await zipCodeInfo.json()) ?? {};

        setStreetName(jsonZipCodeInfo.logradouro);
        setDistrict(jsonZipCodeInfo.bairro);
        setCity(jsonZipCodeInfo.localidade);
        setState(jsonZipCodeInfo.uf);
      }
    }
  };

  function zipCodeMask(zipCode) {
    return zipCode
      ?.replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  }

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setInvalidState(false);
    setState(event.target.value?.toUpperCase());
  };

  async function isValidState(uf) {
    if (!uf) return false;

    const apiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}`;
    const state = await fetch(apiUrl, { mode: 'cors' });
    const jsonResponse = (await state?.json()) ?? {};

    if (jsonResponse?.sigla) return true;

    return false;
  }

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const noMaskZipCode = zipCode?.replace(/\D/g, '');
    const noMaskCpf = cpf?.replace(/\D/g, '');
    let invalid = false;

    if (noMaskZipCode?.length < 8 && noMaskZipCode?.length > 0) {
      setInvalidZipCode(true);
      invalid = true;
    }

    if (noMaskCpf?.length < 11 && noMaskCpf?.length > 0) {
      setInvalidCpf(true);
      invalid = true;
    }

    if (!isValidCpf(noMaskCpf) && noMaskCpf?.length > 0) {
      setInvalidCpf(true);
      invalid = true;
    }

    const validState = await isValidState(state);
    if (!validState && state?.length) {
      setInvalidState(true);
      invalid = true;
    }

    if (invalid) return;

    setLoading(true);

    const body = JSON.stringify({
      address: {
        streetName,
        number,
        complement,
        zipCode: noMaskZipCode,
        city,
        state,
        district,
      },
      CPF: noMaskCpf,
      birthDate,
    });
    const response = await fetch(`${apiBaseUrl}/api/adopter/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    setLoading(false);

    if (response.status === 500) toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else {
      setUserInformationModalOpen(false);
      setAdoptionInformationModalOpen(true);
    }

    setLoading(false);
  };

  return (
    <div className="animalModal">
      <div className="animalModalBody">
        <button className="animalModalClose" onClick={() => setUserInformationModalOpen(false)}>
          X
        </button>
        <h1 className="animalModalTitle">Suas informações</h1>
        <form className="signUpForm" onSubmit={handleSubmit}>
          <label className="inputLabel">CPF</label>
          <input
            type="text"
            className={`signUpInput invalid${invalidCpf}`}
            required
            id="CPF"
            value={cpf}
            placeholder="CPF"
            onChange={handleCpfChange}
          />
          <label className="inputLabel">Data de nascimento</label>
          <input
            type="date"
            className="signUpInput"
            required
            id="birthDate"
            value={birthDate}
            placeholder="Data de nascimento"
            onChange={handleBirthDateChange}
          />
          <label className="inputLabel">CEP</label>
          <input
            type="text"
            className={`signUpInput invalid${invalidZipCode}`}
            required
            id="zipCode"
            value={zipCode}
            placeholder="CEP"
            onChange={handleZipCodeChange}
          />
          <label className="inputLabel">Rua</label>
          <input
            type="text"
            maxLength="250"
            className="signUpInput"
            required
            id="streetName"
            value={streetName}
            placeholder="Rua"
            onChange={handleStreetNameChange}
          />
          <label className="inputLabel">Número</label>
          <input
            type="text"
            maxLength="20"
            className="signUpInput"
            required
            id="number"
            value={number}
            placeholder="Número"
            onChange={handleNumberChange}
          />
          <label className="inputLabel">Complemento</label>
          <input
            type="text"
            maxLength="250"
            className="signUpInput"
            id="complement"
            value={complement}
            placeholder="Complemento"
            onChange={handleComplementChange}
          />
          <label className="inputLabel">Cidade</label>
          <input
            type="text"
            maxLength="250"
            className="signUpInput"
            required
            id="city"
            value={city}
            placeholder="Cidade"
            onChange={handleCityChange}
          />
          <label className="inputLabel">UF</label>
          <input
            type="text"
            maxLength="2"
            className={`signUpInput invalid${invalidState}`}
            required
            id="state"
            value={state}
            placeholder="UF"
            onChange={handleStateChange}
          />
          <label className="inputLabel">Bairro</label>
          <input
            type="text"
            maxLength="250"
            className="signUpInput"
            required
            id="district"
            value={district}
            placeholder="Bairro"
            onChange={handleDistrictChange}
          />

          <button type="submit" className="signUpButton animalButton">
            {!loading && 'Próximo'}
            {loading && (
              <ThreeDots height="21" radius="9" color="#1C3144" ariaLabel="three-dots-loading" />
            )}
          </button>
        </form>
      </div>
      <Toaster toastOptions={{ style: { zIndex: '1000' } }} />
    </div>
  );
}
