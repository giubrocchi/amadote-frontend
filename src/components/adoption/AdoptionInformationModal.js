import { React, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { apiBaseUrl } from '../utils/links';
import { houseSituationOptions } from '../utils/constants';

export default function AdoptionInformationModal(props) {
  const { user, setAdoptionInformationModalOpen, animalId, adoptionCenterId } = props;
  const [adoptionReason, setAdoptionReason] = useState('');
  const [petSitter, setPetSitter] = useState('');
  const [houseSituation, setHouseSituation] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleAdoptionReasonChange = (event) => {
    setAdoptionReason(event.target.value);
  };

  const handlePetSitterChange = (event) => {
    setPetSitter(event.target.value);
  };

  const handleHouseSituationChange = ({ target }) => {
    if (target.checked) {
      setHouseSituation([...houseSituation, target.value]);

      return;
    }

    setHouseSituation(houseSituation.filter((situation) => situation !== target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const proposalResponse = await fetch(`${apiBaseUrl}/api/adoptionProposal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adoptionReason,
        petSitter,
        houseSituation,
        _idAnimal: animalId,
        _idAdoptionCenter: adoptionCenterId,
        _idAdopter: user?._id,
      }),
    });

    const animalResponse = await fetch(`${apiBaseUrl}/api/animal/${animalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'pendingAdoption' }),
    });

    setLoading(false);

    if (proposalResponse.status === 500 || animalResponse.status === 500)
      toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else {
      setAdoptionInformationModalOpen(false);
      toast.success(`Pedido de adoção realizada com sucesso! Em breve a ONG repsonsável entrará em\
contato com você`);
    }

    setLoading(false);
  };

  return (
    <div className="animalModal">
      <div className="animalModalBody">
        <button className="animalModalClose" onClick={() => setAdoptionInformationModalOpen(false)}>
          X
        </button>
        <h1 className="animalModalTitle">Informações sobre a adoção</h1>
        <form className="signUpForm" onSubmit={handleSubmit}>
          <label className="inputLabel">Motivo da adoção</label>
          <input
            type="text"
            className="signUpInput"
            required
            id="adoptionReason"
            value={adoptionReason}
            placeholder="Motivo da adoção"
            onChange={handleAdoptionReasonChange}
          />
          <label className="inputLabel">Quem cuidará do animal</label>
          <input
            type="text"
            className="signUpInput"
            required
            id="petSitter"
            value={petSitter}
            placeholder="Quem cuidará do animal"
            onChange={handlePetSitterChange}
          />
          <label className="inputLabel">Situação da residência</label>
          <label className="inputLabel" style={{ fontSize: 18 }}>
            Tipo de residência
          </label>
          {houseSituationOptions.house.map(({ value, label }) => {
            return (
              <div className="checkboxValue" key={value}>
                <input
                  type="checkbox"
                  className="checkbox"
                  value={value}
                  name="houseSituation"
                  onChange={handleHouseSituationChange}
                />
                <label className="checkboxText">{label}</label>
              </div>
            );
          })}
          <label className="inputLabel" style={{ fontSize: 18 }}>
            Andares
          </label>
          {houseSituationOptions.floors.map(({ value, label }) => {
            return (
              <div className="checkboxValue" key={value}>
                <input
                  type="checkbox"
                  className="checkbox"
                  value={value}
                  name="houseSituation"
                  onChange={handleHouseSituationChange}
                />
                <label className="checkboxText">{label}</label>
              </div>
            );
          })}
          <label className="inputLabel" style={{ fontSize: 18 }}>
            Telas
          </label>
          {houseSituationOptions.meshed.map(({ value, label }) => {
            return (
              <div className="checkboxValue" key={value}>
                <input
                  type="checkbox"
                  className="checkbox"
                  value={value}
                  name="houseSituation"
                  onChange={handleHouseSituationChange}
                />
                <label className="checkboxText">{label}</label>
              </div>
            );
          })}
          <label className="inputLabel" style={{ fontSize: 18 }}>
            Quintal
          </label>
          {houseSituationOptions.backyard.map(({ value, label }) => {
            return (
              <div className="checkboxValue" key={value}>
                <input
                  type="checkbox"
                  className="checkbox"
                  value={value}
                  name="houseSituation"
                  onChange={handleHouseSituationChange}
                />
                <label className="checkboxText">{label}</label>
              </div>
            );
          })}
          <label className="inputLabel" style={{ fontSize: 18 }}>
            Outros
          </label>
          {houseSituationOptions.other.map(({ value, label }) => {
            return (
              <div className="checkboxValue" key={value}>
                <input
                  type="checkbox"
                  className="checkbox"
                  value={value}
                  name="houseSituation"
                  onChange={handleHouseSituationChange}
                />
                <label className="checkboxText">{label}</label>
              </div>
            );
          })}
          <button type="submit" className="signUpButton animalButton">
            {!loading && 'Solicitar adoção'}
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
