import { React, useEffect, useState } from 'react';
import { apiBaseUrl } from '../utils/links';
import { ColorRing } from 'react-loader-spinner';
import EditProfileAdoptionCenter from './EditProfileAdoptionCenter';
import EditProfileAdopter from './EditProfileAdopter';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [profileInfos, setProfileInfos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserProfile(id) {
      if (!id) navigate('/entrar');

      setLoading(true);

      const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
      const adoptionCenterUrl = `${apiBaseUrl}/api/adoptionCenter/${id}`;
      const adopterResult = await fetch(adopterUrl);

      if (adopterResult.ok) {
        const jsonAdopterResult = (await adopterResult?.json()) ?? {};

        setProfile(jsonAdopterResult.profile);
        setProfileInfos(jsonAdopterResult);
      } else {
        const adoptionCenterResult = await fetch(adoptionCenterUrl);
        if (adoptionCenterResult.ok) {
          const jsonAdoptionCenterResult = (await adoptionCenterResult?.json()) ?? {};

          setProfile(jsonAdoptionCenterResult.profile);
          setProfileInfos(jsonAdoptionCenterResult);
        }
      }

      setLoading(false);
    }

    getUserProfile(localStorage.getItem('loggedId'));
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        onClick={() => navigate('/perfil')}
        style={{ alignSelf: 'flex-start', marginLeft: '5%', cursor: 'pointer' }}
      >
        <IconContext.Provider value={{ color: '#1C3144', size: '40px' }}>
          <AiOutlineArrowLeft />
        </IconContext.Provider>
      </div>

      <h1 style={{ marginBottom: '50px' }}>Editar perfil</h1>
      {profile === 'adopter' && <EditProfileAdopter profileInfos={profileInfos} />}
      {profile === 'adoptionCenter' && <EditProfileAdoptionCenter profileInfos={profileInfos} />}
      {loading && (
        <ColorRing
          visible={true}
          height="200"
          width="200"
          colors={['#1C3144', '#1C3144', '#1C3144', '#1C3144', '#1C3144']}
        />
      )}
    </div>
  );
}
