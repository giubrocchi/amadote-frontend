import { React, useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { apiBaseUrl } from '../utils/links';
import { postCategories } from '../utils/constants';
import toast, { Toaster } from 'react-hot-toast';
import 'react-tabs/style/react-tabs.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function AdminProfile({ adminName }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [solicitations, setSolicitations] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [change, setChange] = useState(true);
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState();
  const [postCategory, setPostCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const html = convertToHTML(editorState.getCurrentContent());

    setPostText(html);
  }, [editorState]);

  function logout() {
    localStorage.removeItem('loggedId');
    window.dispatchEvent(new Event('storage'));
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

  useEffect(() => {
    async function getAdoptions() {
      const response = await fetch(`${apiBaseUrl}/api/adoptionProposal/getAllConcluded`);
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

    getAdoptions();
  }, []);

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

  async function registerPost(event) {
    event.preventDefault();

    if (!postCategory) {
      toast.error('Selecione uma categoria.');

      return;
    }

    if (postText.length < 20) {
      toast.error('Seu texto não atingiu o limite mínimo de caracteres :(');

      return;
    }

    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(postImage);
    });

    const response = await fetch(`${apiBaseUrl}/api/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        text: postText,
        title: postTitle,
        category: postCategory,
      }),
    });

    if (response.status === 400) toast.error('Preencha todos os campos corretamente.');
    else if (response.status === 500)
      toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
    else navigate('/postagens');
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
          <Tab>Adoções concluídas</Tab>
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
                          {new Date(data.createdAt).toLocaleDateString()}
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
            <form onSubmit={registerPost}>
              <div className="formGroup">
                <label>Imagem: </label>
                <input
                  type="file"
                  className="signUpFile"
                  required
                  accept="image/png, image/jpeg"
                  onChange={(e) => setPostImage(e.target.files[0])}
                />
              </div>
              <div className="formGroup">
                <label>Título:</label>
                <input
                  type="text"
                  required
                  className="postTitle"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>
              <div className="formGroup">
                <label>Categoria:</label>
                <Select
                  name="category"
                  options={postCategories}
                  placeholder="Categoria"
                  onChange={({ value }) => setPostCategory(value)}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      marginBottom: '20px',
                      fontSize: '18px',
                      color: '#1C3144',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      outline: 'none',
                    }),
                  }}
                />
              </div>
              <div className="formGroup">
                <label>Texto:</label>
                <Editor
                  wrapperClassName="textEditorWrapper"
                  editorClassName="textEditor"
                  toolbar={{ image: { uploadEnabled: false } }}
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                />
              </div>
              <button type="submit" className="postButton">
                Publicar
              </button>
            </form>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="adminAdoptions">
            {adoptions?.map((adoption) => (
              <div className="adoptionBox" key={adoption?._id}>
                <img
                  src={adoption?.animal?.photos?.[0]}
                  alt="animal"
                  style={{ maxWidth: '200px' }}
                />
                <div className="adoptionInformation">
                  <h1>{adoption?.animal?.name}</h1>
                  <p>Espécie: {adoption?.animal?.species}</p>
                  <p>Raça: {adoption?.animal?.breed}</p>
                  <p>
                    Data da solicitação:&nbsp;
                    {new Date(adoption?.createdAt)?.toLocaleDateString('en-GB')}
                  </p>
                  <p>
                    Data da adoção:&nbsp;
                    {new Date(adoption?.acceptedAt)?.toLocaleDateString('en-GB')}
                  </p>
                  <p>ONG: {adoption?.adoptionCenter?.corporateName}</p>
                  <p>Adotante: {adoption?.adopter?.fullName}</p>
                  <p>
                    Contrato de adoção: <a href={adoption?.confirmationDocument}>Abrir</a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
      <Toaster />
    </div>
  );
}
