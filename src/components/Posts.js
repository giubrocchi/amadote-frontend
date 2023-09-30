import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import PostCard from './utils/PostCard';

export default function Posts() {
  const [posts, setPosts] = useState([]);

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
    <div className="postsBody">
      <div className="aboutHeader">
        <h1 className="aboutHeaderTitle">Postagens para a nossa comunidade!</h1>
        <p className="aboutHeaderDescription">
          Conheça nossos adotantes felizes, veja fotos de animais adoráveis e aprenda sobre cuidados
          com alimentação, exercícios e treinamento. Junte-se a nossa comunidade para inspirar a
          adoção responsável e garantir a felicidade e o bem-estar dos nossos amigos peludos e
          emplumados.
        </p>
      </div>
      <div className="postsList">
        {posts?.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </div>
  );
}
