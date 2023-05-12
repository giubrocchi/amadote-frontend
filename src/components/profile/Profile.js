import { React, useEffect, useState } from 'react';
import { apiBaseUrl } from '../utils/links';
import AdminProfile from './AdminProfile';
import AdoptionCenterProfile from './AdoptionCenterProfile';
import AdopterProfile from './AdopterProfile';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserProfile(id){
      if(!id) navigate('/entrar');

      setLoading(true);

      const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
      const adoptionCenterUrl = `${apiBaseUrl}/api/adoptionCenter/${id}`;
      const adopterResult = await fetch(adopterUrl);

      if(adopterResult.ok) {
        const jsonAdopterResult = await adopterResult?.json() ?? {};

        setProfile(jsonAdopterResult.profile);
        setName(jsonAdopterResult.fullName);
      }

      else{
        const adoptionCenterResult = await fetch(adoptionCenterUrl);
        if(adoptionCenterResult.ok){
          const jsonAdoptionCenterResult = await adoptionCenterResult?.json() ?? {};

          setProfile(jsonAdoptionCenterResult.profile);
          setName(jsonAdoptionCenterResult.corporateName);
        }
      }
      
      setLoading(false);
    }

    getUserProfile(localStorage.getItem('loggedId'));
  }, [navigate]);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
      {profile === 'adopter' &&
        <AdopterProfile adopterName={name}/>
      }
      {profile === 'admin' &&
        <AdminProfile adminName={name}/>
      }
      {profile === 'adoptionCenter' &&
        <AdoptionCenterProfile corporateName={name}/>
      }
      {loading &&
        <ColorRing
          visible={true}
          height="200"
          width="200"
          colors={['#1C3144', '#1C3144', '#1C3144', '#1C3144', '#1C3144']}
        />
      }
    </div>
  )
}