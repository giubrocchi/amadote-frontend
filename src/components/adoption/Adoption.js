import { React, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { apiBaseUrl } from '../utils/links';
import { IconContext } from 'react-icons';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import { BsSend } from 'react-icons/bs';
import toast, { Toaster } from 'react-hot-toast';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { houseSituationOptions } from '../utils/constants';
import FinishAdoptionModal from './FinishAdoptionModal';

export default function Adoption() {
  const { id: adoptionId } = useParams();
  const [userType, setUserType] = useState('');

  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [adoption, setAdoption] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [finishModalOpen, setSFinishModalOpen] = useState(false);
  const [finishMode, setFinishMode] = useState('');

  const author = localStorage.getItem('loggedId');
  const receiver =
    author === adoption?.adopter?._id ? adoption?.adoptionCenter?._id : adoption?.adopter?._id;

  const adoptionStatus = {
    inAnalysis: 'Em análise',
    concluded: 'Concluída',
    rejected: 'Rejeitada',
  };

  useEffect(() => {
    if (author) {
      socket.current = io(apiBaseUrl);
      socket.current.emit('addUser', author);
    }
  }, [author]);

  useEffect(() => {
    async function getMessages() {
      if (!author || !receiver) return;

      const messages = await fetch(`${apiBaseUrl}/api/chat/getChat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, receiver }),
      });
      const jsonMessages = (await messages?.json()) ?? [];
      const mappedMessages = jsonMessages.sort(
        (previous, newData) => new Date(previous?.sentAt) - new Date(newData?.sentAt),
      );

      setMessages(mappedMessages);
    }

    getMessages();

    if (socket.current) {
      socket.current.on('messageRecieved', () => getMessages());
    }
  }, [author, receiver]);

  useEffect(() => {
    async function getAdoption() {
      const response = await fetch(`${apiBaseUrl}/api/adoptionProposal/getid/${adoptionId}`);
      const jsonResponse = (await response?.json()) ?? [];

      const mappedAdoption = await mapAdoption(jsonResponse);
      setAdoption(mappedAdoption);
    }

    async function mapAdoption(adoption) {
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
    }

    async function getUserProfile(id) {
      const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
      const adoptionCenterUrl = `${apiBaseUrl}/api/adoptionCenter/${id}`;
      const adopterResult = await fetch(adopterUrl);

      if (adopterResult.ok) setUserType('adopter');
      else {
        const adoptionCenterResult = await fetch(adoptionCenterUrl);

        if (adoptionCenterResult.ok) setUserType('adoptionCenter');
      }
    }

    getUserProfile(localStorage.getItem('loggedId'));
    getAdoption();
  }, [adoptionId]);

  async function handleSendMessage() {
    const trimmedMessage = currentMessage.trim();

    if (!trimmedMessage) return;

    const body = { message: trimmedMessage, author, receiver };
    const chatResponse = await fetch(`${apiBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (chatResponse.ok) {
      setCurrentMessage('');
      socket.current.emit('sendMessage', body);
      setMessages([...messages, body]);

      return;
    }

    toast.error('Erro ao enviar mensagem.\nTente novamente mais tarde.');
  }

  async function getAdoption() {
    const response = await fetch(`${apiBaseUrl}/api/adoptionProposal/getid/${adoptionId}`);
    const jsonResponse = (await response?.json()) ?? [];

    const mappedAdoption = await mapAdoption(jsonResponse);
    setAdoption(mappedAdoption);
  }

  async function mapAdoption(adoption) {
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
  }

  function openFinishAdoptionModal(mode) {
    setFinishMode(mode);
    setSFinishModalOpen(true);
  }

  return (
    <div className="adoptionBody">
      {finishModalOpen && (
        <FinishAdoptionModal
          setSFinishModalOpen={setSFinishModalOpen}
          adoption={adoption}
          finishMode={finishMode}
          getAdoption={getAdoption}
        />
      )}
      <div className="adoptContainer">
        <div className="adoptionInfo">
          {userType === 'adopter' && (
            <>
              <div className="adoptionAnimalName">
                <h1 style={{ margin: 0 }}>{adoption?.animal?.name}</h1>
                {adoption?.animal?.sex === 'F' && (
                  <IconContext.Provider value={{ color: '#F9A03F', size: '35px' }}>
                    <BsGenderFemale />
                  </IconContext.Provider>
                )}
                {adoption?.animal?.sex === 'M' && (
                  <IconContext.Provider value={{ color: '#3F88C5', size: '35px' }}>
                    <BsGenderMale />
                  </IconContext.Provider>
                )}
              </div>
              <img
                src={adoption?.animal?.photos?.[0]}
                className="adoptionAnimalPhoto"
                alt="animal"
              />
              <div className="adoptionAnimalInfo">
                <p>Espécie: {adoption?.animal?.species}</p>
                <p>Raça: {adoption?.animal?.breed}</p>
                <p>
                  Data da solicitação: {new Date(adoption?.createdAt).toLocaleDateString('en-GB')}
                </p>
                <p>Situação: {adoptionStatus[adoption?.status]}</p>
              </div>
              <div className="adoptionOrganizationInfo">
                <h2 style={{ margin: 0 }}>ONG</h2>
                <p>Nome: {adoption?.adoptionCenter?.corporateName}</p>
                <p>E-mail: {adoption?.adoptionCenter?.email}</p>
                <p>
                  Telefone:
                  {adoption?.adoptionCenter?.telephone
                    .replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d)(\d{4})$/, '$1-$2')}
                </p>
              </div>
            </>
          )}
          {userType === 'adoptionCenter' && (
            <div className="adoptionAdopterInfo">
              <Accordion
                allowZeroExpanded
                allowMultipleExpanded
                preExpanded={['animal']}
                style={{ width: '90%' }}
              >
                <AccordionItem uuid="animal">
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ width: '92%' }}>
                      <h2 style={{ margin: 0, display: 'inline' }}>Animal</h2>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div className="adoptionAnimalName">
                      <h1 style={{ margin: 0 }}>{adoption?.animal?.name}</h1>
                      {adoption?.animal?.sex === 'F' && (
                        <IconContext.Provider value={{ color: '#F9A03F', size: '35px' }}>
                          <BsGenderFemale />
                        </IconContext.Provider>
                      )}
                      {adoption?.animal?.sex === 'M' && (
                        <IconContext.Provider value={{ color: '#3F88C5', size: '35px' }}>
                          <BsGenderMale />
                        </IconContext.Provider>
                      )}
                    </div>
                    <img
                      src={adoption?.animal?.photos?.[0]}
                      className="adoptionAnimalPhoto"
                      alt="animal"
                    />
                    <div className="adoptionAnimalInfo">
                      <p>Espécie: {adoption?.animal?.species}</p>
                      <p>Raça: {adoption?.animal?.breed}</p>
                      <p>
                        Data da solicitação:{' '}
                        {new Date(adoption?.createdAt).toLocaleDateString('en-GB')}
                      </p>
                      <p>Situação: {adoptionStatus[adoption?.status]}</p>
                      {adoption?.acceptedAt && (
                        <div
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                        >
                          <p style={{ margin: 0 }}>Documento de confirmação:&nbsp;</p>
                          <a href={adoption?.confirmationDocument} style={{ fontSize: 18 }}>
                            Abrir
                          </a>
                        </div>
                      )}
                      {adoption?.excludedAt && (
                        <div
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                        >
                          <p style={{ margin: 0 }}>
                            Motivo da rejeição: {adoption?.exclusionDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ width: '92%' }}>
                      <h2 style={{ margin: 0, display: 'inline' }}>Adotante</h2>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <p>Nome: {adoption?.adopter?.fullName}</p>
                    <p>E-mail: {adoption?.adopter?.email}</p>
                    <p>
                      Telefone:&nbsp;
                      {adoption?.adopter?.telephone
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '($1) $2')
                        .replace(/(\d)(\d{4})$/, '$1-$2')}
                    </p>
                    <p>
                      CPF:&nbsp;
                      {adoption?.adopter?.CPF?.replace(/\D/g, '')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                        .replace(/(-\d{2})\d+?$/, '$1')}
                    </p>
                    <p>
                      Endereço:&nbsp;
                      {`${adoption?.adopter?.address?.streetName}, \
${adoption?.adopter?.address?.number} - ${adoption?.adopter?.address?.district}, \
${adoption?.adopter?.address?.city} - ${adoption?.adopter?.address?.state}`}
                    </p>
                    <p>
                      CEP:&nbsp;
                      {adoption?.adopter?.address?.zipCode
                        ?.replace(/\D/g, '')
                        .replace(/(\d{5})(\d)/, '$1-$2')
                        .replace(/(-\d{3})\d+?$/, '$1')}
                    </p>
                    <p>
                      Data de nascimento:&nbsp;
                      {new Date(adoption?.adopter?.birthDate)?.toLocaleDateString('en-GB')}
                    </p>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ width: '92%' }}>
                      <h2 style={{ margin: 0, display: 'inline' }}>Adoção</h2>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <p>Motivo da adoção: {adoption?.adoptionReason}</p>
                    <p>Quem cuidará do animal: {adoption?.petSitter}</p>
                    <div>
                      <p>Situação da residência:</p>
                      <div style={{ display: 'flex', flexFlow: 'wrap', gap: 10 }}>
                        {adoption?.houseSituation?.map((situation) => (
                          <div className="adoptionHouseSituation" key={situation}>
                            <p>
                              {
                                houseSituationOptions.find((option) => option?.value === situation)
                                  ?.label
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
              {!adoption?.acceptedAt && !adoption?.excludedAt && (
                <div className="adoptionButtonContainer">
                  <button
                    className="adoptionFinishButton"
                    onClick={() => openFinishAdoptionModal('confirm')}
                    style={{ backgroundColor: '#3f88c5' }}
                  >
                    Confirmar adoção
                  </button>
                  <button
                    className="adoptionFinishButton"
                    onClick={() => openFinishAdoptionModal('reject')}
                    style={{ backgroundColor: '#e94747' }}
                  >
                    Rejeitar adoção
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="adoptionChat">
          <div className="chatMessages">
            {messages?.map((message) => {
              return (
                <div
                  className={`chatBubble ${message?.author === author ? 'sender' : 'receiver'}`}
                  key={message?._id}
                >
                  {message?.message}
                </div>
              );
            })}
          </div>
          <div className="adoptionChatInput">
            <textarea
              className="adoptionChatTextarea"
              onChange={(e) => setCurrentMessage(e.target.value)}
              value={currentMessage}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey === false) handleSendMessage();
              }}
            />
            <div
              className="sendMessageButton"
              style={{ padding: '10px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={handleSendMessage}
            >
              <IconContext.Provider value={{ color: '#F9A03F', size: '30px' }}>
                <BsSend />
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
