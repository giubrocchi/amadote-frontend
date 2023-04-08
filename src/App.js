import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/tutorials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file: image }),
    });

    const { imageUrl } = await response.json();
    setImageUrl(imageUrl);
  };

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      setImage(reader.result);
    };
  };

  return (
    <div>
      <h1>Image Uploader</h1>
      <form onSubmit={handleImageUpload}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Uploaded" />
          <p>Image URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
}

export default App;
