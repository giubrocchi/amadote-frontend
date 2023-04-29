import { React, useEffect, useState } from 'react';
import { apiBaseUrl } from '../links';
import './Profile.css';
import AdminProfile from './AdminProfile';

export default function Profile() {
  const [profile, setProfile] = useState();

  useEffect(() => {
    async function getUserProfile(id){
      const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
      const adoptionCenterUrl = `${apiBaseUrl}/api/adoptionCenter/${id}`;
      const adopterResult = await fetch(adopterUrl);
      const jsonAdopterResult = await adopterResult?.json() ?? {};

      if(jsonAdopterResult.profile) setProfile(jsonAdopterResult.profile);

      else{
        const adoptionCenterResult = await fetch(adoptionCenterUrl);
        const jsonAdoptionCenterResult = await adoptionCenterResult?.json() ?? {};

        if(jsonAdoptionCenterResult.profile) setProfile(jsonAdoptionCenterResult.profile);
      }
    }

    getUserProfile(localStorage.getItem('loggedId'));
  });

  return (
    <div>
      {profile === 'adopter' &&
        <div>Adopter</div>
      }
      {profile === 'admin' &&
        <AdminProfile />
      }
      {profile === 'adoptionCenter' &&
        <div>adoptionCenter</div>
      }
      {!profile &&
        <div>Not logged in</div>
      }
    </div>
  )
}