import { React, useState } from 'react';
import Select from 'react-select';
import { species, sizes, sex, personalities } from '../utils/constants';
import { ThreeDots } from 'react-loader-spinner';
import { apiBaseUrl } from '../utils/links';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateAnimalModal({ setAnimalModalOpen, setReloadAnimalList }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [specie, setSpecie] = useState('');
  const [size, setSize] = useState('');
  const [breed, setBreed] = useState('');
  const [animalSex, setSex] = useState('');
  const [personality, setPersonality] = useState([]);
  const [description, setDescription] = useState('');
  const [vaccinated, setVaccinated] = useState();
  const [castrated, setCastrated] = useState();
  const [special, setSpecial] = useState();
  const [microchip, setMicrochip] = useState();
  const [photos, setPhotos] = useState([]);

  const [loading, setLoading] = useState(false);
  const speciesOptions = species.map((name) => {
    return { value: name, label: name };
  });
  const sizesOptions = sizes.map((name) => {
    return { value: name, label: name };
  });
  const sexOptions = sex.map((name) => {
    return { value: name, label: name };
  });
  const personalitiesOptions = personalities.map((name) => {
    return { value: name, label: name };
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const promises = Array.from(photos).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const base64Photos = await Promise.all(promises);
    const response = await fetch(`${apiBaseUrl}/api/animal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        photos: base64Photos,
        birthDate,
        species: specie,
        size,
        breed,
        sex: animalSex,
        personality,
        description,
        isVaccinated: vaccinated,
        isCastrated: castrated,
        isSpecial: special,
        hasMicrochip: microchip,
        _idAdoptionCenter: localStorage.getItem('loggedId'),
      }),
    });

    setLoading(false);

    if (response.status === 400) toast.error('Preencha todos os campos corretamente.');
    else if (response.status === 500)
      toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else {
      setAnimalModalOpen(false);
      setReloadAnimalList(true);
    }
  }

  function handleFileChange(event) {
    setPhotos(event.target.files);
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleBirthDateChange(event) {
    setBirthDate(event.target.value);
  }

  function handleSpecieChange({ value }) {
    setSpecie(value);
  }

  function handleSizeChange({ value }) {
    setSize(value);
  }

  function handleBreedChange(event) {
    setBreed(event.target.value);
  }

  function handleSexChange({ value }) {
    setSex(value);
  }

  function handlePersonalityChange(value) {
    setPersonality(value.map(({ value }) => value));
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleVaccinatedChange(value) {
    setVaccinated(value);
  }

  function handleCastratedChange(value) {
    setCastrated(value);
  }

  function handleSpecialChange(value) {
    setSpecial(value);
  }

  function handleMicrochipChange(value) {
    setMicrochip(value);
  }

  return (
    <div className="animalModal">
      <div className="animalModalBody">
        <button className="animalModalClose" onClick={() => setAnimalModalOpen(false)}>
          X
        </button>
        <h1 className="animalModalTitle">Cadastrar um animal</h1>
        <form className="signUpForm" onSubmit={handleSubmit}>
          <p className="animalModalLabelTitle" style={{ marginBottom: '10px' }}>
            Fotos
          </p>
          <input
            type="file"
            className="signUpFile"
            required
            accept="image/png, image/jpeg"
            multiple
            onChange={handleFileChange}
          />
          <input
            type="text"
            maxLength="250"
            className="signUpInput"
            required
            id="name"
            value={name}
            placeholder="Nome*"
            onChange={handleNameChange}
          />
          <input
            type="date"
            className="signUpInput"
            required
            id="birthDate"
            value={birthDate}
            placeholder="Data de nascimento*"
            onChange={handleBirthDateChange}
          />
          <Select
            name="specie"
            options={speciesOptions}
            required
            placeholder="Espécie*"
            onChange={(value) => handleSpecieChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none',
              }),
            }}
          />
          <Select
            name="size"
            options={sizesOptions}
            required
            placeholder="Porte*"
            onChange={(value) => handleSizeChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none',
              }),
            }}
          />
          <input
            type="text"
            maxLength="80"
            className="signUpInput"
            required
            id="breed"
            value={breed}
            placeholder="Raça*"
            onChange={handleBreedChange}
          />
          <Select
            name="sex"
            options={sexOptions}
            required
            placeholder="Sexo*"
            onChange={(value) => handleSexChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none',
              }),
            }}
          />
          <Select
            name="personality"
            options={personalitiesOptions}
            required
            isMulti
            placeholder="Personalidade*"
            onChange={(value) => handlePersonalityChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none',
              }),
            }}
          />
          <textarea
            maxLength="1000"
            className="signUpInput"
            required
            id="description"
            value={description}
            placeholder="Descrição e história do animal*"
            onChange={handleDescriptionChange}
          />
          <div className="animalModalLabel">
            <p className="animalModalLabelTitle">Vacinado:</p>
            <input
              type="radio"
              name="vaccinated"
              id="vaccinated"
              onClick={() => handleVaccinatedChange(true)}
              required
            />
            <label className="animalModalLabelText" htmlFor="vaccinated">
              Sim
            </label>
            <input
              type="radio"
              name="vaccinated"
              id="notVaccinated"
              onClick={() => handleVaccinatedChange(false)}
            />
            <label className="animalModalLabelText" htmlFor="notVaccinated">
              Não
            </label>
          </div>
          <div className="animalModalLabel">
            <p className="animalModalLabelTitle">Castrado:</p>
            <input
              type="radio"
              name="castrated"
              id="castrated"
              onClick={() => handleCastratedChange(true)}
              required
            />
            <label className="animalModalLabelText" htmlFor="castrated">
              Sim
            </label>
            <input
              type="radio"
              name="castrated"
              id="notCastrated"
              onClick={() => handleCastratedChange(false)}
            />
            <label className="animalModalLabelText" htmlFor="notCastrated">
              Não
            </label>
          </div>
          <div className="animalModalLabel">
            <p className="animalModalLabelTitle">Necessidade especial:</p>
            <input
              type="radio"
              name="special"
              id="special"
              onClick={() => handleSpecialChange(true)}
              required
            />
            <label className="animalModalLabelText" htmlFor="special">
              Sim
            </label>
            <input
              type="radio"
              name="special"
              id="notSpecial"
              onClick={() => handleSpecialChange(false)}
            />
            <label className="animalModalLabelText" htmlFor="notSpecial">
              Não
            </label>
          </div>
          <div className="animalModalLabel">
            <p className="animalModalLabelTitle">Microchipado:</p>
            <input
              type="radio"
              name="microship"
              id="microship"
              onClick={() => handleMicrochipChange(true)}
              required
            />
            <label className="animalModalLabelText" htmlFor="microship">
              Sim
            </label>
            <input
              type="radio"
              name="microship"
              id="notMicroship"
              onClick={() => handleMicrochipChange(false)}
            />
            <label className="animalModalLabelText" htmlFor="notMicroship">
              Não
            </label>
          </div>

          <button type="submit" className="signUpButton animalButton">
            {!loading && 'Cadastrar'}
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
