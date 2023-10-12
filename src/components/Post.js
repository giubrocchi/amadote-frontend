import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiBaseUrl } from './utils/links';
import parse from 'html-react-parser';
import { postCategories } from './utils/constants';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getPost() {
      const response = await fetch(`${apiBaseUrl}/api/post/getid/${id}`);
      const jsonResponse = (await response?.json()) ?? {};

      setPost(jsonResponse);
    }

    getPost();
  }, [id]);

  useEffect(() => {
    async function getUserProfile(id) {
      const adopterUrl = `${apiBaseUrl}/api/adopter/${id}`;
      const adopterResult = await fetch(adopterUrl);

      if (adopterResult.ok) {
        const jsonAdopterResult = (await adopterResult?.json()) ?? {};

        if (jsonAdopterResult.profile === 'admin') setIsAdmin(true);
      }
    }

    getUserProfile(localStorage.getItem('loggedId'));
  }, []);

  async function deletePost(id) {
    const response = await fetch(`${apiBaseUrl}/api/post/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      navigate('/postagens');
    } else if (response.status === 500)
      toast.error('Ops! Ocorreu um erro, tente novamente mais tarde.');
  }

  return (
    <div className="postBody">
      {isAdmin && (
        <button className="adoptionFinishButton" onClick={() => deletePost(post?._id)}>
          Deletar
        </button>
      )}
      <h1 style={{ textAlign: 'center' }}>{post?.title}</h1>
      <p>Categoria: {postCategories.find(({ value }) => value === post?.category)?.label}</p>
      <p>Data de publicação: {new Date(post?.createdAt)?.toLocaleDateString('en-GB')}</p>
      <img src={post?.image} alt={post?.title} className="inPostImage" />
      <div className="postContent">{parse(post?.text ?? '')}</div>
      <Toaster />
    </div>
  );
}
