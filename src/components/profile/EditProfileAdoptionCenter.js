import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { apiBaseUrl } from '../utils/links';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

function EditProfileAdoptionCenter({ profileInfos = {} }) {
  const [corporateName, setCorporateName] = useState(profileInfos.corporateName);
  const [telephone, setTelephone] = useState(phoneMask(profileInfos.telephone));
  const [email, setEmail] = useState(profileInfos.email);
  const previousEmail = profileInfos.email;
  const [password, setPassword] = useState('************');
  const CNPJ = cnpjMask(profileInfos.CNPJ);
  const [streetName, setStreetName] = useState(profileInfos.address?.streetName);
  const [number, setNumber] = useState(profileInfos.address?.number);
  const [complement, setComplement] = useState(profileInfos.address?.complement);
  const [zipCode, setZipCode] = useState(zipCodeMask(profileInfos.address?.zipCode));
  const [city, setCity] = useState(profileInfos.address?.city);
  const [state, setState] = useState(profileInfos.address?.state);
  const [district, setDistrict] = useState(profileInfos.address?.district);
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingChangePw, setLoadingChangePw] = useState(false);
  const [invalidTelephone, setInvalidTelephone] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidZipCode, setInvalidZipCode] = useState(false);
  const [invalidState, setInvalidState] = useState(false);
  const [isChangingPassword, setChangingPassword] = useState(false);
  const [isDeleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCorporateNameChange = (event) => {
    setCorporateName(event.target.value);
  };

  const handleTelephoneChange = (event) => {
    setInvalidTelephone(false);
    setTelephone(phoneMask(event.target.value));
  };

  function phoneMask(phone) {
    return phone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setInvalidPassword(false);
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setInvalidPassword(false);
    setNewPassword(event.target.value);
  };

  const handleDeletePasswordChange = (event) => {
    setDeletePassword(event.target.value);
  };

  function cnpjMask(cnpj) {
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
      .replace(/\D/g, '')
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

    const noMaskTelephone = telephone?.replace(/\D/g, '');
    const noMaskZipCode = zipCode?.replace(/\D/g, '');
    let invalid = false;

    if (noMaskTelephone?.length < 8) {
      setInvalidTelephone(true);
      invalid = true;
    }

    if (noMaskZipCode?.length < 8) {
      setInvalidZipCode(true);
      invalid = true;
    }

    const validState = await isValidState(state);
    if (!validState) {
      setInvalidState(true);
      invalid = true;
    }

    if (invalid) return;

    setLoading(true);

    const hasEmailChanged = previousEmail !== email;
    const body = hasEmailChanged
      ? JSON.stringify({
          corporateName,
          telephone: noMaskTelephone,
          email,
          address: {
            streetName,
            number,
            complement,
            zipCode: noMaskZipCode,
            city,
            state,
            district,
          },
        })
      : JSON.stringify({
          corporateName,
          telephone: noMaskTelephone,
          address: {
            streetName,
            number,
            complement,
            zipCode: noMaskZipCode,
            city,
            state,
            district,
          },
        });
    const response = await fetch(`${apiBaseUrl}/api/adoptionCenter/${profileInfos._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    setLoading(false);

    if (response.status === 500)
      showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else navigate('/perfil');
  };

  async function changePassword(event) {
    event.preventDefault();

    if (!isValidPassword(newPassword)) {
      setInvalidPassword(true);
      return;
    }

    setLoadingChangePw(true);

    const response = await fetch(`${apiBaseUrl}/api/adoptionCenter/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: profileInfos?.email, password }),
    });
    const jsonResponse = (await response.json()) ?? {};

    if (response.status === 500) {
      showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
      setLoadingChangePw(false);
      return;
    }

    if (!jsonResponse.login) {
      showErrorAlert('Senha incorreta!');
      setLoadingChangePw(false);
      return;
    }

    if (jsonResponse.login) {
      const response = await fetch(`${apiBaseUrl}/api/adoptionCenter/${profileInfos._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (response.status === 500)
        showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
      else navigate('/perfil');
    }

    setLoadingChangePw(false);
  }

  async function deleteAccount(event) {
    event.preventDefault();

    setLoadingDelete(true);

    const response = await fetch(`${apiBaseUrl}/api/adoptionCenter/${profileInfos._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: deletePassword,
      }),
    });

    if (response.status === 500)
      showErrorAlert('Ops! Ocorreu um erro, tente novamente mais tarde.');
    if (response.status === 404)
      showErrorAlert('Perfil não encontrado. Entre com sua conta e tente novamente.');
    if (response.status === 400) showErrorAlert('Senha incorreta!');
    if (response.status === 401) showErrorAlert('E-mail já cadastrado.');
    else {
      localStorage.removeItem('loggedId');
      window.dispatchEvent(new Event('storage'));
      navigate('/perfil');
    }

    setLoadingDelete(false);
  }

  function showChangePassword(value) {
    setChangingPassword(value);
    const passwordPlaceholder = value ? '' : '************';
    setPassword(passwordPlaceholder);
  }

  function isValidPassword(password) {
    const validPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$/;

    return validPasswordRegex.test(password);
  }

  function changeModalState(event, value) {
    event.preventDefault();
    setDeletePassword('');
    setDeleteAccountModalOpen(value);
  }

  function showErrorAlert(message) {
    toast.error(message);
  }

  return (
    <div className="formBody">
      {isDeleteAccountModalOpen && (
        <div className="animalModal">
          <div className="deleteAccountModalBody">
            <h2>Insira sua senha para deletar a sua conta.</h2>
            <input
              type="password"
              maxLength="250"
              className={`signUpInput`}
              id="deletePassword"
              value={deletePassword}
              required
              placeholder="Senha*"
              onChange={handleDeletePasswordChange}
            />
            <div className="deleteButtonsBox">
              <button
                type="cancel"
                className="signUpButton deleteButton"
                onClick={(e) => changeModalState(e, false)}
              >
                Cancelar
              </button>
              <button type="cancel" className="signUpButton" onClick={deleteAccount}>
                {!loadingDelete && 'Confirmar'}
                {loadingDelete && (
                  <ThreeDots
                    height="21"
                    radius="9"
                    color="#1C3144"
                    ariaLabel="three-dots-loading"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {!isChangingPassword && (
        <form className="signUpForm" onSubmit={handleSubmit}>
          <label className="inputLabel">Razão social</label>
          <input
            type="text"
            maxLength="250"
            className="signUpInput"
            required
            id="corporateName"
            value={corporateName}
            placeholder="Razão social*"
            onChange={handleCorporateNameChange}
          />
          <label className="inputLabel">Telefone</label>
          <input
            type="tel"
            maxLength="15"
            className={`signUpInput invalid${invalidTelephone}`}
            required
            id="telephone"
            value={telephone}
            placeholder="Telefone*"
            onChange={handleTelephoneChange}
          />
          <label className="inputLabel">E-mail</label>
          <input
            type="email"
            maxLength="250"
            className={`signUpInput`}
            required
            id="email"
            value={email}
            placeholder="E-mail*"
            onChange={handleEmailChange}
          />
          <label className="inputLabel">CNPJ</label>
          <input
            type="text"
            className={`signUpInput disabledInput`}
            disabled
            id="CNPJ"
            value={CNPJ}
            placeholder="CNPJ*"
          />
          <label className="inputLabel">CEP</label>
          <input
            type="text"
            className={`signUpInput invalid${invalidZipCode}`}
            required
            id="zipCode"
            value={zipCode}
            placeholder="CEP*"
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
            placeholder="Rua*"
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
            placeholder="Número*"
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
            placeholder="Cidade*"
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
            placeholder="UF*"
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
            placeholder="Bairro*"
            onChange={handleDistrictChange}
          />
          <label className="inputLabel">Senha</label>
          <input
            type="password"
            maxLength="250"
            className={`signUpInput disabledInput`}
            disabled
            id="password"
            value={password}
            placeholder="Senha*"
          />
          <p
            style={{
              textAlign: 'left',
              textDecoration: 'underline',
              marginTop: '-10px',
              cursor: 'pointer',
            }}
            onClick={() => showChangePassword(true)}
          >
            Alterar senha
          </p>
          <button type="submit" className="signUpButton" style={{ marginTop: '40px' }}>
            {!loading && 'Salvar'}
            {loading && (
              <ThreeDots height="21" radius="9" color="#1C3144" ariaLabel="three-dots-loading" />
            )}
          </button>
          <button
            type="cancel"
            className="signUpButton deleteButton"
            style={{ marginTop: '40px' }}
            onClick={(e) => changeModalState(e, true)}
          >
            Deletar conta
          </button>
        </form>
      )}
      {isChangingPassword && (
        <form className="signUpForm" onSubmit={changePassword}>
          <label className="inputLabel">Senha atual</label>
          <input
            type="password"
            maxLength="250"
            className={`signUpInput`}
            id="changePassword"
            value={password}
            required
            placeholder="Senha atual*"
            onChange={handlePasswordChange}
          />
          <div
            style={{
              display: invalidPassword ? 'unset' : 'none',
              color: 'red',
              textAlign: 'left',
            }}
          >
            <p>Uma senha deve conter no mínimo 8 caracteres sendo eles:</p>
            <ul>
              <li>Pelo menos uma letra minúscula;</li>
              <li>Pelo menos um caracter especial;</li>
              <li>Pelo menos uma letra maiúscula.</li>
            </ul>
          </div>
          <label className="inputLabel">Nova senha</label>
          <input
            type="password"
            maxLength="250"
            className={`signUpInput inputWithTip`}
            id="newPassword"
            value={newPassword}
            required
            placeholder="Nova senha*"
            onChange={handleNewPasswordChange}
          />
          <p className="passwordTip">
            Sua senha deve conter no mínimo 8 caracteres, pelo menos um caractere especial e pelo
            menos uma letra maiúscula e uma minúscula.
          </p>
          <div className="deleteButtonsBox">
            <button
              type="cancel"
              className="signUpButton deleteButton"
              style={{ marginTop: '40px' }}
              onClick={() => showChangePassword(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="signUpButton" style={{ marginTop: '40px' }}>
              {!loadingChangePw && 'Salvar'}
              {loadingChangePw && (
                <ThreeDots height="21" radius="9" color="#1C3144" ariaLabel="three-dots-loading" />
              )}
            </button>
          </div>
        </form>
      )}
      <Toaster />
    </div>
  );
}

export default EditProfileAdoptionCenter;
