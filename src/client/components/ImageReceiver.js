/* eslint-disable arrow-parens */
import React, { useState } from 'react';

const ImageReceiver = props => {
  const { styledImage, inputImage, currentStyle } = props;
  const [isComputing, setComputing] = useState(false);
  return (
    <div className="column">
      <h3 className="row__headline ui inverted header">Output image</h3>
      {!styledImage ? (
        <div className="ui placeholder segment">
          <div className="ui active dimmer">
            {isComputing && (
              <div className="ui large text loader">Calculating style</div>
            )}
          </div>
          <p></p>
          <p></p>
          <p></p>
        </div>
      ) : (
        <div className="ui placeholder segment">
          <img
            className="ui fluid image"
            src={styledImage}
            draggable={false}
            alt="output"
          />
        </div>
      )}
      <button
        className={`button__input ui primary button ${
          inputImage && currentStyle && !styledImage ? '' : 'disabled'
        }`}
        type="button"
        onClick={() => props.startStyleTransfer(setComputing)}
      >
        Start Neural Style Transfer
      </button>
      <a
        className={`button__output ui primary button ${
          styledImage ? '' : 'disabled'
        }`}
        href={styledImage}
        download
      >
        Download
      </a>
    </div>
  );
};

export default ImageReceiver;
