import { React, useEffect, useState } from 'react';
import { apiBaseUrl } from '../utils/links';
import { ColorRing } from 'react-loader-spinner';

export default function AdoptionList() {
  const [loading, setLoading] = useState(false);
  const [adoptions, setAdoptions] = useState([]);
  const [userType, setUserType] = useState('');
  const adoptionStatus = {
    inAnalysis: 'Em análise',
    concluded: 'Concluída',
    rejected: 'Rejeitada',
  };

  useEffect(() => {
    async function getUserProfile(id) {
      setLoading(true);

      const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
      const adoptionCenterUrl = `${apiBaseUrl}/api/adoptionCenter/${id}`;
      const adopterResult = await fetch(adopterUrl);

      if (adopterResult.ok) {
        const jsonAdopterResult = (await adopterResult?.json()) ?? {};

        getAdoptions({ _idAdopter: jsonAdopterResult._id });
        setUserType('adopter');
      } else {
        const adoptionCenterResult = await fetch(adoptionCenterUrl);
        if (adoptionCenterResult.ok) {
          const jsonAdoptionCenterResult = (await adoptionCenterResult?.json()) ?? {};

          getAdoptions({ _idAdoptionCenter: jsonAdoptionCenterResult._id });
          setUserType('adoptionCenter');
        }
      }

      setLoading(false);
    }

    async function getAdoptions({ _idAdopter, _idAdoptionCenter }) {
      const body = _idAdopter ? { _idAdopter } : { _idAdoptionCenter };
      const response = await fetch(`${apiBaseUrl}/api/adoptionProposal/getAdoptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const jsonResponse = (await response?.json()) ?? [];

      const mappedAdoptions = await mapAdoptions(jsonResponse);
      setAdoptions(mappedAdoptions);
    }

    async function mapAdoptions(adoptions) {
      const mappedAdoptions = await Promise.all(
        adoptions.map(async (adoption) => {
          const adopterResult = await fetch(`${apiBaseUrl}/api/adopter/${adoption?._idAdopter}`);
          const jsonAdopterResult = (await adopterResult?.json()) ?? {};

          const animalResult = await fetch(`${apiBaseUrl}/api/animal/getid/${adoption?._idAnimal}`);
          const jsonAnimalResult = (await animalResult?.json()) ?? {};

          const adoptionCenterResult = await fetch(
            `${apiBaseUrl}/api/adoptionCenter/${adoption?._idAdoptionCenter}`,
          );
          const jsonAdoptionCenterResult = (await adoptionCenterResult?.json()) ?? {};

          return {
            ...adoption,
            adopter: jsonAdopterResult,
            animal: jsonAnimalResult,
            adoptionCenter: jsonAdoptionCenterResult,
          };
        }),
      );

      return mappedAdoptions;
    }

    getUserProfile(localStorage.getItem('loggedId'));
  }, []);

  return (
    <div className="adoptionsBody">
      <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>Suas adoções</h1>
      {loading && (
        <ColorRing
          visible={true}
          height="200"
          width="200"
          colors={['#1C3144', '#1C3144', '#1C3144', '#1C3144', '#1C3144']}
        />
      )}
      <div className="adoptionContainer">
        {!loading &&
          adoptions?.map((adoption) => (
            <div className="adoptionBox" key={adoption?._id}>
              <img src={adoption?.animal?.photos?.[0]} />
              <div className="adoptionInformation">
                <h1>{adoption?.animal?.name}</h1>
                <p>
                  Data da solicitação: {new Date(adoption?.createdAt)?.toLocaleDateString('en-GB')}
                </p>
                {userType === 'adopter' && <p>ONG: {adoption?.adoptionCenter?.corporateName}</p>}
                {userType === 'adoptionCenter' && <p>Adotante: {adoption?.adopter?.fullName}</p>}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <p>Status:&nbsp;</p>
                  <p className={`adoptionStatus${adoption?.status}`}>
                    {adoptionStatus[adoption?.status]}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
