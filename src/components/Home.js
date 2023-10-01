import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import { useNavigate } from 'react-router-dom';
import AnimalCard from './utils/AnimalCard';
import PostCard from './utils/PostCard';

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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
