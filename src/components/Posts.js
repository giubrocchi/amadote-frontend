import React, { useState, useEffect } from 'react';

export default function Posts() {

  const [allPosts, setAllPosts] = useState([]);

  useEffect(()=>{
    getAllPosts()
  })

  async function getAllPosts(){
    try{
      /*const allPostsApi = await api.get()

      setAllPosts(data);*/
    }catch(err){
      console.log("Erro na listagem dos posts", err)
    }
  }
  
  return (
    <div className="postsBody">
      <h1>Postagens</h1>
      <div className="postsList"></div>
    </div>
  );
}
