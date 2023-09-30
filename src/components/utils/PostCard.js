import React from 'react';
import { postCategories } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <div
      key={post?._id}
      className="postPageBox"
      onClick={() => navigate(`/postagens/${post?._id}`)}
    >
      <img src={post?.image} alt={post?.title} className="postPageImage" />
      <h2 className="postPageTitle">{post?.title}</h2>
      <div className="postPageDetails">
        <div className="postDetailBox">
          <p>Categoria:&nbsp;</p>
          <p>{postCategories.find(({ value }) => value === post?.category)?.label}</p>
        </div>
        <div className="postDetailBox">
          <p>Data:&nbsp;</p>
          <p>{new Date(post?.createdAt)?.toLocaleDateString('en-GB')}</p>
        </div>
      </div>
      <button className="ACProfileAnimalButton">Leia sobre</button>
    </div>
  );
}
