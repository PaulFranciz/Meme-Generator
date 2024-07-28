import React, { useState, useEffect, useRef } from "react";
import { saveAs } from 'file-saver';
import "./memeGenerator.css";

const MemeGenerator = () => {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: "https://nigerianmemes.com.ng/wp-content/uploads/2024/02/GFuz_jzWcAAuBT3-2.webp",
  });
  const [allMemes, setAllMemes] = useState([]);
  const canvasRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  }

  useEffect(() => {
    async function getMemes() {
      const res = await fetch(`https://api.imgflip.com/get_memes`);
      const data = await res.json();
      setAllMemes(data.data.memes);
    }
    getMemes();
  }, []);

  const generateMemes = () => {
    const randomMeme = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomMeme].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      randomImage: url,
    }));
  };





  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMeme((prevMeme) => ({
          ...prevMeme,
          randomImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = meme.randomImage;
    image.crossOrigin = "anonymous";  // Ensure cross-origin image works

    image.onload = () => {
      const canvasWidth = 600;
      const aspectRatio = image.width / image.height;
      const canvasHeight = canvasWidth / aspectRatio;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const fontSize = canvasWidth / 10;
      context.font = `${fontSize}px Impact`;
      context.fillStyle = "white";
      context.textAlign = "center";
      context.strokeStyle = "black";
      context.lineWidth = canvasWidth / 100;

      context.fillText(meme.topText, canvas.width / 2, fontSize + 10);
      context.strokeText(meme.topText, canvas.width / 2, fontSize + 10);
      context.fillText(meme.bottomText, canvas.width / 2, canvas.height - 10);
      context.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 10);

      canvas.toBlob((blob) => {
        saveAs(blob, "meme.png");
      }, 'image/png');
    };
  };

  return (
    <main>
      <div className="form">
        <div>
          <input
            type="text"
            placeholder="Top text"
            name="topText"
            value={meme.topText}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Bottom text"
            name="bottomText"
            value={meme.bottomText}
            onChange={handleChange}
          />
        </div>
        <div className="btn--wrapper">
          <button className="meme-btn" onClick={generateMemes}>
            Generate meme
          </button>
          <label className="upload-btn">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
      <div className="meme--container">
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {meme.randomImage && <img className="meme-image" src={meme.randomImage} alt="Meme" />}
        <p className="meme--text top">{meme.topText}</p>
        <p className="meme--text bottom">{meme.bottomText}</p>
      </div>
      <button className="download--meme" onClick={downloadMeme}>
        Download
      </button>
    </main>
  );
};

export default MemeGenerator;
