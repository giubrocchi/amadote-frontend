import { React, useState, useEffect } from 'react';
import Select from 'react-select';
import { species, sizes, sex, personalities } from '../utils/constants';
import { ThreeDots } from 'react-loader-spinner';
import { apiBaseUrl } from '../utils/links';
import toast, { Toaster } from 'react-hot-toast';

export default function EditAnimalModal({editAnimal, id}) {
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
  const [previousPhotos, setPreviousPhotos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingExclude, setLoadingExclude] = useState(false);
  const speciesOptions = species.map(name => { return { value: name, label: name } });
  const sizesOptions = sizes.map(name => { return { value: name, label: name } });
  const sexOptions = sex.map(name => { return { value: name, label: name } });
  const personalitiesOptions = personalities.map(name => { return { value: name, label: name } });

  useEffect(() => {
    async function getAnimalInfo(){
      const response = await fetch(`${apiBaseUrl}/api/animal/getid/${id}`);
      const jsonResponse = await response?.json() ?? {};

      setName(jsonResponse.name);
      setBirthDate(jsonResponse.birthDate);
      setSpecie(jsonResponse.species);
      setSize(jsonResponse.size);
      setBreed(jsonResponse.breed);
      setSex(jsonResponse.sex);
      setPersonality(jsonResponse.personality);
      setDescription(jsonResponse.description);
      setVaccinated(jsonResponse.isVaccinated);
      setCastrated(jsonResponse.isCastrated);
      setSpecial(jsonResponse.isSpecial);
      setMicrochip(jsonResponse.hasMicrochip);
      setPreviousPhotos(jsonResponse.photos);
    }

    getAnimalInfo();
  }, [id]);

  async function handleSubmit(event){
    event.preventDefault();
    setLoading(true);

    const promises = Array.from(photos).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const base64Photos = await Promise.all(promises);
    const response = await fetch(`${apiBaseUrl}/api/animal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        photos: base64Photos,
        previousPhotos,
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
        hasMicrochip: microchip
      }),
    });

    setLoading(false);

    if(response.status === 401) toast.error('Preencha todos os campos corretamente.');
    else if(response.status === 500) toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else{
      editAnimal('', false);
      window.location.reload();
    }
  }

  async function deleteAnimal(reason){
    setLoadingExclude(true);
    const response = await fetch(`${apiBaseUrl}/api/animal/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason }),
    });
    setLoadingExclude(false);

    if(response.status === 200){
      editAnimal('', false);
      window.location.reload();
    }
    else if(response.status === 500) toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
  }

  function deleteImage(index, event){
    event.preventDefault();

    const deleteFromArray = i => setPreviousPhotos(prev => prev.filter((f, idx) => idx !== i));

    deleteFromArray(index);
  }

  function handleFileChange(event){
    setPhotos(event.target.files);
  }

  function handleNameChange(event){
    setName(event.target.value);
  }

  function handleBirthDateChange(event){
    setBirthDate(event.target.value);
  }

  function handleSpecieChange({value}){
    setSpecie(value);
  }

  function handleSizeChange({value}){
    setSize(value);
  }

  function handleBreedChange(event){
    setBreed(event.target.value);
  }

  function handleSexChange({value}){
    setSex(value);
  }

  function handlePersonalityChange(value){
    setPersonality(value.map(({value}) => value))
  }

  function handleDescriptionChange(event){
    setDescription(event.target.value);
  }

  function handleVaccinatedChange(value){
    setVaccinated(value);
  }

  function handleCastratedChange(value){
    setCastrated(value);
  }

  function handleSpecialChange(value){
    setSpecial(value);
  }

  function handleMicrochipChange(value){
    setMicrochip(value);
  }
  
  return (
    <div className='animalModal'>
      <div className='animalModalBody'>
        <button className='animalModalClose' onClick={() => editAnimal('', false)}>X</button>
        <h1 className='animalModalTitle'>Editar</h1>
        <form className='signUpForm' onSubmit={handleSubmit}>
          <div className='editImagesBox'>
            {
              previousPhotos.map((url, index) => {
                return <div className='editImageContainer' key={index}>
                  <img className='editImage' src={url} alt='Animal'/>
                  <button className='editImageExclude' onClick={(event) => deleteImage(index, event)}>Excluir</button>
                </div>
              })
            }
          </div>
          <p className='signUpInputLabel'>Fotos</p>
          <input type="file" className='signUpFile' accept="image/png, image/jpeg" multiple onChange={handleFileChange} />
          <input type="text" maxLength="250" className='signUpInput' required id='name' value={name} placeholder='Nome*' onChange={handleNameChange} />
          <input type="date" className='signUpInput' required id='birthDate' value={birthDate} placeholder='Data de nascimento*' onChange={handleBirthDateChange}/>
          <Select name="specie" options={speciesOptions} required placeholder='Espécie*' value={{value: specie, label: specie}} onChange={(value) => handleSpecieChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none'
              }),
            }}
          />
          <Select name="size" options={sizesOptions} required placeholder='Porte*' value={{value: size, label: size}} onChange={(value) => handleSizeChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none'
              }),
            }}
          />
          <input type="text" maxLength="80" className='signUpInput' required id='breed' value={breed} placeholder='Raça*' onChange={handleBreedChange} />
          <Select name="sex" options={sexOptions} required placeholder='Sexo*' value={{value: animalSex, label: animalSex}} onChange={(value) => handleSexChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none'
              }),
            }}
          />
          <Select name="personality" options={personalitiesOptions} value={personality.map(name => {return {value: name, label: name}})} required isMulti placeholder='Personalidade*' onChange={(value) => handlePersonalityChange(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '20px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none'
              }),
            }}
          />
          <textarea maxLength="1000" className='signUpInput' required id='description' value={description} placeholder='Descrição e história do animal*' onChange={handleDescriptionChange} />
          <div className='animalModalLabel'>
            <p className='animalModalLabelTitle'>Vacinado</p>
            <input type='radio' name='vaccinated' checked={vaccinated===true} onChange={() => handleVaccinatedChange(true)} required/><label className='animalModalLabelText'>Sim</label>
            <input type='radio' name='vaccinated' checked={vaccinated===false} onChange={() => handleVaccinatedChange(false)} /><label className='animalModalLabelText'>Não</label>
          </div>
          <div className='animalModalLabel'>
            <p className='animalModalLabelTitle'>Castrado</p>
            <input type='radio' name='castrated' checked={castrated===true} onChange={() => handleCastratedChange(true)} required/><label className='animalModalLabelText'>Sim</label>
            <input type='radio' name='castrated' checked={castrated===false} onChange={() => handleCastratedChange(false)} /><label className='animalModalLabelText'>Não</label>
          </div>
          <div className='animalModalLabel'>
            <p className='animalModalLabelTitle'>Necessidade especial</p>
            <input type='radio' name='special' checked={special===true} onChange={() => handleSpecialChange(true)} required/><label className='animalModalLabelText'>Sim</label>
            <input type='radio' name='special' checked={special===false} onChange={() => handleSpecialChange(false)} /><label className='animalModalLabelText'>Não</label>
          </div>
          <div className='animalModalLabel'>
            <p className='animalModalLabelTitle'>Microchipado</p>
            <input type='radio' name='microchip' checked={microchip===true} onChange={() => handleMicrochipChange(true)} required/><label className='animalModalLabelText'>Sim</label>
            <input type='radio' name='microchip' checked={microchip===false} onChange={() => handleMicrochipChange(false)} /><label className='animalModalLabelText'>Não</label>
          </div>

          <button type="submit" className='signUpButton animalButton'>
            {!loading && 'Confirmar'}
            {loading && <ThreeDots height='21' radius='9' color="#1C3144" ariaLabel="three-dots-loading"/>}
          </button>
        </form>

        <div className='deleteButtonsBox'>
          <button className='signUpButton deleteButton' onClick={() => deleteAnimal('other')}>
            {!loadingExclude && 'Excluir'}
            {loadingExclude && <ThreeDots height='21' radius='9' color="#1C3144" ariaLabel="three-dots-loading"/>}
          </button>

          <button className='signUpButton deleteButton' onClick={() => deleteAnimal('adoptedByOtherMeans')}>
            {!loadingExclude && 'Animal adotado por outro meio'}
            {loadingExclude && <ThreeDots height='21' radius='9' color="#1C3144" ariaLabel="three-dots-loading"/>}
          </button>
        </div>
      </div>
      <Toaster toastOptions={{style: {zIndex: '1000'}}}/>
    </div>
  )
}