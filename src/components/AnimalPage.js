import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import { useParams } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  MaskHappy,
  CrownSimple,
  HeartStraight,
  Butterfly,
  Moon,
  Mountains,
  Ghost,
  ShieldCheckered,
  Door,
  FlowerTulip,
  Feather,
  Tree,
  BowlFood,
  Baby,
} from '@phosphor-icons/react';
import { IconContext } from 'react-icons';
import toast, { Toaster } from 'react-hot-toast';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import UserInformationModal from './adoption/UserInformationModal';
import AdoptionInformationModal from './adoption/AdoptionInformationModal';

const personalityIcons = {
  Brincalhão: <MaskHappy size={30} color="#9747FF" />,
  Independente: <CrownSimple size={30} color="#FFE600" />,
  Amoroso: <HeartStraight size={30} color="rgba(186, 0, 0, 0.66)" />,
  Curioso: <Butterfly size={30} color="#FA00FF" />,
  Preguiçoso: <Moon size={30} color="#002BC1" />,
  Aventureiro: <Mountains size={30} color="#3D2121" />,
  Assustado: <Ghost size={30} color="#787878" />,
  Protetor: <ShieldCheckered size={30} color="#2F9200" />,
  Teimoso: <Door size={30} color="#442424" />,
  Dócil: <FlowerTulip size={30} color="#AD00FF" />,
  Sossegado: <Feather size={30} color="#3F88C5" />,
  'Ama o ar livre': <Tree size={30} color="#42FF00" />,
  Comilão: <BowlFood size={30} color="#F9A03F" />,
  'Bom com crianças': <Baby size={30} color="#B99999" />,
};

export default function AnimalsPage() {
  const [animal, setAnimal] = useState({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { id: animalId } = useParams();
  const [age, setAge] = useState();
  const [months, setMonths] = useState();
  const [birth, setBirth] = useState();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isAdopterLogged, setIsAdopterLogged] = useState(false);
  const [userFavourites, setUserFavourites] = useState([]);
  const [adoptionCenter, setAdoptionCenter] = useState({});
  const [user, setUser] = useState({});

  const favouriteErrorMessage =
    'Você deve entrar com uma conta de adotante para adicionar o animal aos favoritos!';

  const [isUserInformationModalOpen, setUserInformationModalOpen] = useState(false);
  const [isAdoptionInformationModalOpen, setAdoptionInformationModalOpen] = useState(false);

  useEffect(() => {
    async function getUser(id) {
      const adopterResult = await fetch(`${apiBaseUrl}/api/adopter/${id}`);

      if (adopterResult.ok) {
        const jsonAdopter = await adopterResult?.json();
        const isFavourite = jsonAdopter?.favourites?.includes(animalId);

        setIsAdopterLogged(true);
        setIsFavourite(isFavourite);
        if (jsonAdopter?.favourites) setUserFavourites(jsonAdopter.favourites);
      }
    }

    getUser(localStorage.getItem('loggedId'));
  }, []);

  useEffect(() => {
    async function getAnimal() {
      const response = await fetch(`${apiBaseUrl}/api/animal/getid/${animalId}`);
      const jsonResponse = (await response?.json()) ?? {};

      setAnimal(jsonResponse);

      const now = new Date();
      const birth = new Date(jsonResponse?.birthDate);
      const age = Math.round((now.getTime() - birth?.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const months = Math.abs(now.getMonth() - birth?.getMonth());

      setAge(age);
      setMonths(months);
      setBirth(birth);

      const adoptionCenter = await fetch(
        `${apiBaseUrl}/api/adoptionCenter/${jsonResponse?._idAdoptionCenter}`,
      );
      const jsonAdoptionCenter = (await adoptionCenter?.json()) ?? {};

      setAdoptionCenter(jsonAdoptionCenter);
    }

    getAnimal();
  }, [animalId]);

  function getPreviousPhoto() {
    if (currentPhotoIndex === 0) setCurrentPhotoIndex(animal?.photos?.length - 1);
    else setCurrentPhotoIndex((previousValue) => setCurrentPhotoIndex(previousValue - 1));
  }

  function getNextPhoto() {
    if (currentPhotoIndex === animal?.photos?.length - 1) setCurrentPhotoIndex(0);
    else setCurrentPhotoIndex((previousValue) => setCurrentPhotoIndex(previousValue + 1));
  }

  async function onAdoptButtonClicked() {
    const adopter = await getUserProfile(localStorage.getItem('loggedId'));

    if (!adopter.ok) {
      toast.error('Você deve entrar com uma conta de adotante para poder realizar a adoção.');

      return;
    }

    const jsonResponse = (await adopter?.json()) ?? {};

    setUser(jsonResponse);
    setUserInformationModalOpen(true);
  }

  async function getUserProfile(id) {
    const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
    const adopterResult = await fetch(adopterUrl);

    return adopterResult;
  }

  async function addToFavourites() {
    if (!isAdopterLogged) toast.error(favouriteErrorMessage);

    const response = await fetch(`${apiBaseUrl}/api/adopter/${localStorage.getItem('loggedId')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favourites: [...userFavourites, animalId] }),
    });

    if (response.status === 500) {
      toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');

      return;
    }

    setIsFavourite(true);
    setUserFavourites([...userFavourites, animalId]);
  }

  async function removeFromFavourites() {
    if (!isAdopterLogged) toast.error(favouriteErrorMessage);

    const response = await fetch(`${apiBaseUrl}/api/adopter/${localStorage.getItem('loggedId')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favourites: userFavourites.filter((id) => id !== animalId) }),
    });

    if (response.status === 500) {
      toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');

      return;
    }

    setIsFavourite(false);
    setUserFavourites(userFavourites.filter((id) => id !== animalId));
  }

  return (
    <div className="animalBody">
      {isUserInformationModalOpen && (
        <UserInformationModal
          user={user}
          setUserInformationModalOpen={setUserInformationModalOpen}
          setAdoptionInformationModalOpen={setAdoptionInformationModalOpen}
        />
      )}
      {isAdoptionInformationModalOpen && (
        <AdoptionInformationModal
          user={user}
          setAdoptionInformationModalOpen={setAdoptionInformationModalOpen}
          animalId={animalId}
          adoptionCenterId={adoptionCenter?._id}
        />
      )}
      <div className="animalColumn" id="leftAnimalColumn">
        <div className={`photoSlider ${animal?.photos?.length > 1 ? 'photoGrid' : ''}`}>
          {animal?.photos?.length > 1 && (
            <IconContext.Provider value={{ color: '#1C3144', size: '40px' }}>
              <IoIosArrowBack onClick={getPreviousPhoto} style={{ cursor: 'pointer' }} />
            </IconContext.Provider>
          )}
          <img src={animal?.photos?.[currentPhotoIndex]} className="animalPhoto" alt="animal" />
          {animal?.photos?.length > 1 && (
            <IconContext.Provider value={{ color: '#1C3144', size: '40px' }}>
              <IoIosArrowForward onClick={getNextPhoto} style={{ cursor: 'pointer' }} />
            </IconContext.Provider>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <button className="adoptButton" onClick={onAdoptButtonClicked}>
            Quero adotar!
          </button>
          {!isFavourite && (
            <IconContext.Provider value={{ color: 'rgba(186, 0, 0, 0.66)', size: '50px' }}>
              <FaRegHeart onClick={addToFavourites} style={{ cursor: 'pointer' }} />
            </IconContext.Provider>
          )}
          {isFavourite && (
            <IconContext.Provider value={{ color: 'rgba(186, 0, 0, 0.66)', size: '50px' }}>
              <FaHeart onClick={removeFromFavourites} style={{ cursor: 'pointer' }} />
            </IconContext.Provider>
          )}
        </div>
        <div className="animalAdoptionCenterInfo">
          <div className="orgInfo">
            <p>Publicado por:</p>
            <p>{adoptionCenter?.corporateName}</p>
          </div>
          <div className="orgInfo">
            <p>Data:</p>
            <p>{new Date(animal?.createdAt)?.toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>
      <div className="animalColumn">
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <h1>{animal?.name}</h1>
          {animal?.sex === 'F' && (
            <IconContext.Provider value={{ color: '#F9A03F', size: '35px' }}>
              <BsGenderFemale />
            </IconContext.Provider>
          )}
          {animal?.sex === 'M' && (
            <IconContext.Provider value={{ color: '#3F88C5', size: '35px' }}>
              <BsGenderMale />
            </IconContext.Provider>
          )}
        </div>
        <div className="animalPersonalities">
          {animal?.personality?.map((personality) => (
            <div
              key={personality}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {personalityIcons[personality]}
              <p key={personality} style={{ margin: 0 }}>
                {personality}
              </p>
            </div>
          ))}
        </div>
        <div className="animalHistory">
          <h2 style={{ marginBottom: 10 }}>História</h2>
          <p style={{ margin: 0 }}>{animal?.description}</p>
        </div>
        <div className="animalDataSheet">
          <h2 style={{ marginBottom: 10 }}>Ficha técnica</h2>
          <div className="animalData">
            <p>Espécie:</p>
            <p>{animal?.species}</p>
          </div>
          <div className="animalData">
            <p>Raça:</p>
            <p>{animal?.breed}</p>
          </div>
          <div className="animalData">
            <p>Sexo:</p>
            <p>
              {animal?.sex === 'M' && 'Macho'}
              {animal?.sex === 'F' && 'Fêmea'}
            </p>
          </div>
          <div className="animalData">
            <p>Porte:</p>
            <p>{animal?.size}</p>
          </div>
          <div className="animalData">
            <p>Necessidade especial:</p>
            <p>
              {animal?.isSpecial && 'Sim'}
              {!animal?.isSpecial && 'Não'}
            </p>
          </div>
          <div className="animalData">
            <p>Microchipado:</p>
            <p>
              {animal?.hasMicrochip && 'Sim'}
              {!animal?.hasMicrochip && 'Não'}
            </p>
          </div>
          <div className="animalData">
            <p>Idade:</p>
            <p>
              {age > 0
                ? `${age} ano${age === 1 ? '' : 's'}`
                : `${months} ${months === 1 ? 'mês' : 'meses'}`}
            </p>
          </div>
          <div className="animalData">
            <p>Nascimento:</p>
            <p>{birth?.toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
