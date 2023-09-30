import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiBaseUrl } from './utils/links';
import parse from 'html-react-parser';
import { postCategories } from './utils/constants';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    async function getPost() {
      const response = await fetch(`${apiBaseUrl}/api/post/getid/${id}`);
      const jsonResponse = (await response?.json()) ?? {};

      setPost(jsonResponse);
    }

    getPost();
  }, [id]);

  return (
    <div className="postBody">
      <h1>{post?.title}</h1>
      <p>Categoria: {postCategories.find(({ value }) => value === post?.category)?.label}</p>
      <p>Data de publicação: {new Date(post?.createdAt)?.toLocaleDateString('en-GB')}</p>
      <img src={post?.image} alt={post?.title} className="inPostImage" />
      <div className="postContent">{parse(post?.text ?? '')}</div>
    </div>
  );
}
