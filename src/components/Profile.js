import { React, useEffect, useState } from 'react';
import { apiBaseUrl } from './utils/links';
import AdminProfile from './AdminProfile';
import { ColorRing } from 'react-loader-spinner';

export default function Profile() {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUserProfile(id){
      setLoading(true);

      const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
      const adoptionCenterUrl = `${apiBaseUrl}/api/adoptionCenter/${id}`;
      const adopterResult = await fetch(adopterUrl);

      if(adopterResult.ok) {
        const jsonAdopterResult = await adopterResult?.json() ?? {};

        setProfile(jsonAdopterResult.profile);
      }

      else{
        const adoptionCenterResult = await fetch(adoptionCenterUrl);
        if(adoptionCenterResult.ok){
          const jsonAdoptionCenterResult = await adoptionCenterResult?.json() ?? {};

          setProfile(jsonAdoptionCenterResult.profile);
        }
      }
      
      setLoading(false);
    }

    getUserProfile(localStorage.getItem('loggedId'));
  }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
      {profile === 'adopter' &&
        <div>Adopter</div>
      }
      {profile === 'admin' &&
        <AdminProfile />
      }
      {profile === 'adoptionCenter' &&
        <div>adoptionCenter</div>
      }
      {loading &&
        <ColorRing
          visible={true}
          height="200"
          width="200"
          colors={['#1C3144', '#1C3144', '#1C3144', '#1C3144', '#1C3144']}
        />
      }
      {!profile && !loading &&
        <div>Not logged in</div>
      }
    </div>
  )
}