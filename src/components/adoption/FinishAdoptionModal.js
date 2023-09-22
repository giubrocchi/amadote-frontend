import { React, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { apiBaseUrl } from '../utils/links';
import toast, { Toaster } from 'react-hot-toast';

export default function FinishAdoptionModal({
  setSFinishModalOpen,
  adoption,
  finishMode,
  getAdoption,
}) {
  const [confirmationDocument, setConfirmationDocument] = useState();
  const [exclusionDescription, setExclusionDescription] = useState('');
  const [loading, setLoading] = useState(false);

  function handleFileChange(event) {
    setConfirmationDocument(event.target.files[0]);
  }

  function handleExclusionDescriptionChange(event) {
    setExclusionDescription(event.target.value);
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    const reader = new FileReader();

    reader.onloadend = async () => {
      setLoading(true);

      const pdfBase64 = reader.result.replace('data:', '').replace(/^.+,/, '');
      const response = await fetch(
        `${apiBaseUrl}/api/adoptionProposal/acceptAdoption/${adoption?._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            confirmationDocument: pdfBase64,
            animalId: adoption?.animal?._id,
          }),
        },
      );

      setLoading(false);

      if (response.status === 401) toast.error('Preencha todos os campos corretamente.');
      else if (response.status === 500)
        toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
      else {
        toast.success('Adoção realizada com sucesso!');
        setSFinishModalOpen(false);
        getAdoption();
      }
    };
    reader.readAsDataURL(confirmationDocument);
  }

  async function handleRejectionSubmit(event) {
    event.preventDefault();
    const response = await fetch(
      `${apiBaseUrl}/api/adoptionProposal/rejectAdoption/${adoption?._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exclusionDescription,
          animalId: adoption?.animal?._id,
        }),
      },
    );

    setLoading(false);

    if (response.status === 401) toast.error('Preencha todos os campos corretamente.');
    else if (response.status === 500)
      toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else {
      toast.success('Adoção rejeitada com sucesso!');
      setSFinishModalOpen(false);
      getAdoption();
    }
  }

  return (
    <div className="animalModal">
      <div className="animalModalBody">
        <button className="animalModalClose" onClick={() => setSFinishModalOpen(false)}>
          X
        </button>
        {finishMode === 'confirm' && (
          <>
            <h1 className="animalModalTitle">Confirmar adoção</h1>
            <form className="signUpForm" onSubmit={handleConfirmationSubmit}>
              <p className="animalModalLabelTitle" style={{ marginBottom: '10px' }}>
                Contrato de adoção
              </p>
              <input
                type="file"
                className="signUpFile"
                required
                accept=".pdf"
                onChange={handleFileChange}
              />

              <button type="submit" className="signUpButton animalButton">
                {!loading && 'Confirmar'}
                {loading && (
                  <ThreeDots
                    height="21"
                    radius="9"
                    color="#1C3144"
                    ariaLabel="three-dots-loading"
                  />
                )}
              </button>
            </form>
          </>
        )}
        {finishMode === 'reject' && (
          <>
            <h1 className="animalModalTitle">Rejeitar adoção</h1>
            <form className="signUpForm" onSubmit={handleRejectionSubmit}>
              <p className="animalModalLabelTitle" style={{ marginBottom: '10px' }}>
                Motivo da rejeição
              </p>
              <textarea
                className="signUpInput"
                required
                maxLength="250"
                value={exclusionDescription}
                onChange={handleExclusionDescriptionChange}
              />

              <button type="submit" className="signUpButton animalButton">
                {!loading && 'Rejeitar'}
                {loading && (
                  <ThreeDots
                    height="21"
                    radius="9"
                    color="#1C3144"
                    ariaLabel="three-dots-loading"
                  />
                )}
              </button>
            </form>
          </>
        )}
      </div>
      <Toaster toastOptions={{ style: { zIndex: '1000' } }} />
    </div>
  );
}
