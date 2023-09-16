import { React, useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

export default function Adoption() {
  const location = useLocation();
  const adoption = location?.state?.adoptionInfo ?? {};
  const userType = location?.state?.userType ?? {};
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
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
      const messages = await fetch(`${apiBaseUrl}/api/chat/getChat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, receiver }),
      });
      const jsonMessages = (await messages?.json()) ?? [];
      const mappedMessages = jsonMessages.sort(
        (previous, newData) => new Date(previous?.sentAt) - new Date(newData?.sentAt),
      );

      jsonMessages.sort((previous, newData) =>
        console.log({
          previous,
          newData,
          date: new Date(previous?.sentAt) - new Date(newData?.sentAt),
        }),
      );

      setMessages(mappedMessages);
    }

    getMessages();

    if (socket.current) {
      socket.current.on('messageRecieved', () => getMessages());
    }
  }, [author, receiver]);

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

  return (
    <div className="adoptionBody">
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
