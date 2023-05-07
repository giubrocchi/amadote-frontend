import { React, useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { apiBaseUrl } from '../utils/links';
import toast, { Toaster } from 'react-hot-toast';
import 'react-tabs/style/react-tabs.css';
import './AdminProfile.css';

export default function AdminProfile() {
  const [solicitations, setSolicitations] = useState([]);
  const [change, setChange] = useState(true);

  useEffect(() => {
    getSolicitations();
  },[change]);

  async function getSolicitations(){
    const url = `${apiBaseUrl}/api/adoptionCenter/solicitations`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonResponse = await response.json() ?? [];

    setSolicitations(jsonResponse);
  }

  async function handleButtonAction(status, id){
    const url = `${apiBaseUrl}/api/adoptionCenter/status`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, id, admin: localStorage.getItem('loggedId') })
    });

    if(response.status !== 200) toast.error('Erro ao realizar análise, tente novamente mais tarde.');
    else setChange(!change);
  }

  return (
    <div className='adminProfileBody'>
      <Tabs>
        <TabList>
          <Tab>Solicitações de cadastro</Tab>
          <Tab>Publicar</Tab>
        </TabList>

        <TabPanel>
          <div className='adminProfileBox'>
            {
              solicitations.map((data) => {
                return <div className='solicitationBox' key={data._id}>
                  <div className='solicitationTextBox'>
                    <div className='solicitationTextLine'>
                      <p className='solicitationTextLabel'>Razão social:</p><p className='solicitationTextData'>{data.corporateName}</p>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>Telefone:</p><p className='solicitationTextData'>{data.telephone}</p>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>E-mail:</p><p className='solicitationTextData'>{data.email}</p>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>CNPJ:</p><p className='solicitationTextData'>{data.CNPJ}</p>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>Documento de registo:</p><a href={data.registrationDocument} className='solicitationTextData'>Download</a>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>Data:</p><p className='solicitationTextData'>{(new Date(parseInt(data.createdAt))).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className='solicitationTextBox'>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>Endereço:</p><p className='solicitationTextData'>{data.address.streetName}, {data.address.number}</p>
                    </div>
                    {data.address.complement &&
                      <div className='solicitationTextLine'>
                        <p className='solicitationTextLabel'>Complemento:</p><p className='solicitationTextData'>{data.address.complement}</p>
                      </div>
                    }
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>CEP:</p><p className='solicitationTextData'>{data.address.zipCode}</p>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>Cidade:</p><p className='solicitationTextData'>{data.address.city}</p>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>UF:</p><p className='solicitationTextData'>{data.address.state}</p>
                    </div>
                    <div className='solicitationTextLine'>
                    <p className='solicitationTextLabel'>Bairro:</p><p className='solicitationTextData'>{data.address.district}</p>
                    </div>
                  </div>
                  <div className='solicitationButtonBox'>
                    <button className='solicitationButton' id='accept' onClick={() => handleButtonAction('accepted', data._id)}>Aprovar</button>
                    <button className='solicitationButton' id='reject' onClick={() => handleButtonAction('rejected', data._id)}>Rejeitar</button>
                  </div>
                </div>
              })
            }
          </div>
        </TabPanel>
        <TabPanel>
          <h2>Fazer publicação</h2>
        </TabPanel>
      </Tabs>
      <Toaster/>
    </div>
  )
}