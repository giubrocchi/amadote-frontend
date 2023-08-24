import { React, useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { apiBaseUrl } from '../utils/links';
import toast, { Toaster } from 'react-hot-toast';
import 'react-tabs/style/react-tabs.css';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { IconContext } from 'react-icons';

export default function AdminProfile({ adminName }) {
  const [solicitations, setSolicitations] = useState([]);
  const [change, setChange] = useState(true);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('loggedId');
    navigate('/entrar');
  }

  function phoneMask(phone) {
    return phone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
  }

  function cnpjMask(cnpj) {
    return cnpj
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }

  function zipCodeMask(zipCode) {
    return zipCode
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  }

  useEffect(() => {
    getSolicitations();
  }, [change]);

  async function getSolicitations() {
    const url = `${apiBaseUrl}/api/adoptionCenter/solicitations`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const jsonResponse = (await response.json()) ?? [];

    setSolicitations(jsonResponse);
  }

  async function handleButtonAction(status, id) {
    const url = `${apiBaseUrl}/api/adoptionCenter/status`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        id,
        admin: localStorage.getItem('loggedId'),
      }),
    });

    if (response.status !== 200)
      toast.error('Erro ao realizar análise, tente novamente mais tarde.');
    else setChange(!change);
  }

  return (
    <div className="adminProfileBody">
      <div className="ACProfileHeader">
        <div className="ACProfileNameBox">
          <h1 className="ACProfileName">Olá, {adminName}!</h1>
          <div title="Sair" onClick={() => logout()} style={{ cursor: 'pointer' }}>
            <IconContext.Provider value={{ color: '#1C3144', size: '30px' }}>
              <BiLogOut />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>Solicitações de cadastro</Tab>
          <Tab>Publicar</Tab>
        </TabList>
        <TabPanel>
          <div className="adminProfileBox">
            {solicitations.map((data) => {
              return (
                <div className="solicitationBox" key={data._id}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="solicitationTextBox">
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">Razão social:</p>
                        <p className="solicitationTextData">{data.corporateName}</p>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">Telefone:</p>
                        <p className="solicitationTextData">{phoneMask(data.telephone)}</p>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">E-mail:</p>
                        <p className="solicitationTextData">{data.email}</p>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">CNPJ:</p>
                        <p className="solicitationTextData">{cnpjMask(data.CNPJ)}</p>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">Documento de registo:</p>
                        <a href={data.registrationDocument} className="solicitationTextData">
                          Download
                        </a>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">Data:</p>
                        <p className="solicitationTextData">
                          {new Date(parseInt(data.createdAt)).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="solicitationTextBox">
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">Endereço:</p>
                        <p className="solicitationTextData">
                          {data.address.streetName}, {data.address.number}
                        </p>
                      </div>
                      {data.address.complement && (
                        <div className="solicitationTextLine">
                          <p className="solicitationTextLabel">Complemento:</p>
                          <p className="solicitationTextData">{data.address.complement}</p>
                        </div>
                      )}
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">CEP:</p>
                        <p className="solicitationTextData">{zipCodeMask(data.address.zipCode)}</p>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">Cidade:</p>
                        <p className="solicitationTextData">{data.address.city}</p>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">UF:</p>
                        <p className="solicitationTextData">{data.address.state}</p>
                      </div>
                      <div className="solicitationTextLine">
                        <p className="solicitationTextLabel">Bairro:</p>
                        <p className="solicitationTextData">{data.address.district}</p>
                      </div>
                    </div>
                  </div>
                  <div className="solicitationButtonBox">
                    <button
                      className="solicitationButton"
                      id="accept"
                      onClick={() => handleButtonAction('accepted', data._id)}
                    >
                      Aprovar
                    </button>
                    <button
                      className="solicitationButton"
                      id="reject"
                      onClick={() => handleButtonAction('rejected', data._id)}
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="adminProfileBox">
            <h2>Fazer publicação</h2>
            <form>
              <div className="formGroup">
                <label htmlFor="postTitle">Título da Postagem:</label>
                <input type="text" id="postTitle" name="postTitle" />
              </div>
              <div className="formGroup">
                <label htmlFor="postContent">Conteúdo:</label>
                <textarea id="postContent" name="postContent" rows="4"></textarea>
              </div>
              <div className="formGroup">
                <label>Enviar imagem: </label>
                <label className="fileInputLabel">
                  Escolher imagem
                  <input
                    type="file"
                    id="postImage"
                    name="postImage"
                    accept="image/*"
                    className="fileInput"
                  />
                </label>
              </div>
              <button className="solicitationButton">Publicar</button>
            </form>
          </div>
        </TabPanel>
      </Tabs>
      <Toaster />
    </div>
  );
}
