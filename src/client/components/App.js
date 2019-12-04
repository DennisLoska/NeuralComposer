import React, { useEffect, useState } from 'react';
import './App.scss';
import labrador from '../../../public/images/labrador.png';
import StyleCard from './StyleCard';
import ImageLoader from './ImagePlaceholder';

const App = () => {
  const [styles, setStyles] = useState(null);
  const [currentStyle, setCurrent] = useState(null);

  useEffect(() => {
    fetch('/api/getArtStyles')
      .then(res => res.json())
      .then(artStyles => setStyles(artStyles));
  }, []);

  const setCurrentStyle = style => {
    setCurrent(style);
    console.log(style);
  };

  return (
    <div className="app__wrapper ui container">
      <h1 className="row__headline ui inverted header">Neural Composer</h1>
      <h2 className="row__headline ui inverted dividing header">
        Choose your style!
      </h2>
      <div className="ui six doubling cards">
        {styles ? (
          styles.map((style, i) => (
            <StyleCard
              style={style}
              setCurrentStyle={setCurrentStyle}
              currentStyle={currentStyle}
              key={`style-${i}`}
            />
          ))
        ) : (
          <ImageLoader amount={6} />
        )}
      </div>
      <div className="block__text ui raised very padded text container segment">
        <h2 className="ui header">Where the beauty of art and science meet</h2>
        <p>
          <img
            alt="cute labrador"
            src={labrador}
            className="ui small rounded right floated image"
          />
          This is a web application, which is powered by Node.js and Python in
          the backend to generate artistic images from input images. The
          algorithm is based on the paper called{' '}
          <a
            href="https://arxiv.org/pdf/1508.06576.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            A Neural Algorithm of Artistic Style
          </a>{' '}
          by Leon A. Gatys, Alexander S. Ecker and Matthias Bethge.
        </p>
        <p>
          We created the preview images of the styles with{' '}
          <a
            href="https://deepart.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deepart.io
          </a>{' '}
          and took some inspiration when implementing this project so check them
          out!
        </p>
      </div>
      <h2 className="row__headline ui inverted dividing header">
        Time to create some art!
      </h2>
      <div className="ui stackable two column divided grid container">
        <div className="row">
          <div className="column">
            <h3 className="row__headline ui inverted header">Input image</h3>
            <div className="ui placeholder segment">
              <div className="ui icon header">
                <i className="pdf file outline icon"></i>
                Upload an .png, .jpg or ,jpeg file
              </div>
              <div className="ui primary button">Add Image</div>
            </div>
            <button className="button__input  ui primary button">
              Start Neural Style Transfer
            </button>
          </div>
          <div className="column">
            <h3 className="row__headline ui inverted header">Output image</h3>
            <div className="ui placeholder segment">
              <div className="ui active dimmer">
                <div className="ui large text loader">Calculating style</div>
              </div>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <button className="button__output ui primary button">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
