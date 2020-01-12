/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable arrow-parens */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../index.scss';
import StyleCard from '../StyleCard/StyleCard';
import ImagePlaceholder from '../ImagePlaceHolder/ImagePlaceholder';
import ImageUploader from '../ImageUploader/ImageUploader';
import ImageReceiver from '../ImageReceiver/ImageReceiver';

const App = ({ evolutionStep }) => {
  const [styles, setStyles] = useState(null);
  const [currentStyle, setCurrent] = useState(null);
  const [inputImage, setUploaded] = useState(null);
  const [styledImage, setStyledImage] = useState(null);
  const [imageEvolution, setEvolution] = useState([]);


  useEffect(() => {
    fetch('/api/getArtStyles')
      .then(res => res.json())
      .then(artStyles => setStyles(artStyles));
  }, []);

  const setCurrentStyle = style => {
    setCurrent(style);
    console.log(style);
  };

  const startStyleTransfer = setComputing => {
    setComputing(true);
    console.log(inputImage, currentStyle);
    (async () => {
      const response = await fetch('/api/styleTransfer', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: inputImage, style: currentStyle })
      });
      const data = await response.json();
      setStyledImage(data.imgUrl);
      setEvolution(JSON.parse(data.imgList));
    })();
  };

  return (
    <div className="app__wrapper ui container">
      <h1 className="row__headline ui inverted header">Neural Composer</h1>
      <h2 className="row__headline ui inverted dividing header">
        Choose your style!
      </h2>
      <div className="ui three doubling cards">
        {styles ? (
          styles.map((style, i) => (
            <StyleCard
              style={style}
              setCurrentStyle={setCurrentStyle}
              currentStyle={currentStyle}
              key={`style-${i + 1}`}
            />
          ))
        ) : (
            <ImagePlaceholder amount={6} />
          )}
      </div>
      <div className="block__text ui raised very padded text container segment">
        <h2 className="ui header">Where the beauty of art and science meet</h2>
        <p>
          <img
            alt="cute labrador"
            src="images/labrador.png"
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
      <div className="image__row ui stackable two column divided grid container">
        <div className="row">
          <ImageUploader setUploaded={setUploaded} />
          <ImageReceiver
            styledImage={styledImage}
            inputImage={inputImage}
            currentStyle={currentStyle}
            startStyleTransfer={startStyleTransfer}
          />
        </div>
        {imageEvolution.length > 0 && (
          imageEvolution.map((image, i) => (
            <div className="row" key={`evolution-${i * evolutionStep}`}>
              <div className="sixteen wide column centered">
                <h3 className="row__headline ui inverted header">Epoch {(i + 1) * evolutionStep}</h3>
                <div className="ui placeholder segment">
                  <img
                    className="ui fluid image"
                    src={`data:image/jpeg;base64, ${image}`}
                    draggable={false}
                    alt="evolution"
                  />
                </div>
                <a
                  className={`button__output ui primary button ${
                    styledImage ? '' : 'disabled'
                    }`}
                  href={`data:image/jpeg;base64, ${image}`}
                  download
                >
                  Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

App.propTypes = {
  evolutionStep: PropTypes.number.isRequired
};

export default App;
