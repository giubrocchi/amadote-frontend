import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import { useNavigate } from 'react-router-dom';
import AnimalCard from './utils/AnimalCard';
import PostCard from './utils/PostCard';

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWidth]);

  useEffect(() => {
    async function getAnimals() {
      const response = await fetch(`${apiBaseUrl}/api/animal/`);
      const jsonResponse = (await response?.json()) ?? [];

      setAnimals(jsonResponse);
    }

    getAnimals();
  }, []);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(`${apiBaseUrl}/api/post/`);
      const jsonResponse = (await response?.json()) ?? [];
      const orderedPosts = jsonResponse?.sort(
        (previous, newData) => new Date(newData?.createdAt) - new Date(previous?.createdAt),
      );

      setPosts(orderedPosts);
    }

    getPosts();
  }, []);

  return (
    <div className="homeBody">
      <div className="homeIntroSection">
        <img
          src={`https://amadote.blob.core.windows.net/amadote/banner${
            width < 800 ? 'Small' : ''
          }.png`}
          className="homeBannerImage"
          alt="banner"
          onClick={() => navigate('/match')}
        />
        <h1>Bem-vinde ao Amadote!</h1>
        <p className="homeIntroText">
          Bem-vinde ao nosso site de adoção de animais! Encontre aqui o seu novo melhor amigo e faça
          a diferença na vida de um animal necessitado. Estamos aqui para ajudar no processo de
          adoção e fornecer orientação contínua.
        </p>
        <p className="homeIntroText homeIntroLink" onClick={() => navigate('/institucional')}>
          Saiba mais.
        </p>
        <div className="homeUsers">
          <div
            className="homeUserType"
            onClick={() => navigate('/entrar', { state: { path: 'adopter' } })}
          >
            <p className="homePersonType">Sou pessoa física</p>
            <p className="signUpSubTitle" style={{ margin: 0 }}>
              Quero adotar um animal
            </p>
          </div>
          <div
            className="homeUserType"
            onClick={() => navigate('/entrar', { state: { path: 'adoptionCenter' } })}
          >
            <p className="homePersonType">Sou ONG</p>
            <p className="signUpSubTitle" style={{ margin: 0 }}>
              Quero divulgar um animal e ter controle das adoções
            </p>
          </div>
        </div>
      </div>
      <div className="homeAnimalsSection">
        <h2 className="homeSubtitle">Pets em destaque</h2>
        <p className="homeDescription">
          Encontre o seu pet e faça a diferença na vida de um animal em busca de um lar!
        </p>
        <div className="homeAnimals">
          <div className="homeScroll">
            {animals?.slice(0, 20).map((animal) => {
              return (
                <AnimalCard
                  animalInfo={animal}
                  key={animal._id}
                  buttonOptions={{
                    buttonText: 'Ver mais',
                    buttonFunction: () => navigate(`/animais/${animal._id}`),
                  }}
                />
              );
            })}
            {animals?.length === 0 && (
              <div
                className="ACProfileAnimalBox"
                style={{
                  width: 220,
                  height: 350,
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 26,
                  color: '#b3b3b3',
                }}
              >
                Não temos animais disponíveis no momento :(
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="homeAnimalsSection">
        <h2 className="homeSubtitle">Postagens</h2>
        <p className="homeDescription">Veja dicas, curiosidades e cuidados sobre pets!</p>
        <div className="homeAnimals">
          <div className="homeScroll">
            {posts?.slice(0, 20).map((post) => (
              <PostCard post={post} />
            ))}
            {posts?.length === 0 && (
              <div
                className="postPageBox"
                style={{
                  width: 300,
                  height: 220,
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 26,
                  color: '#b3b3b3',
                }}
              >
                Não temos posts disponíveis no momento :(
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="homeSupportInfo">
        <h2>Gostou da nossa iniciativa?</h2>
        <p>Para conseguirmos deixar o site no ar contamos com o apoio de nossa comunidade!</p>
        <button className="homeSupportButton" onClick={() => navigate('/institucional')}>
          Apoie-nos
        </button>
      </div>
    </div>
  );
}
