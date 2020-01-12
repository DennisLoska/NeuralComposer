/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
          <p />
          <p />
          <p />
        </div>
      ) : (
        <div className="ui placeholder segment">
          <img
            className="ui fluid image"
            src={`data:image/jpeg;base64, ${styledImage}`}
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
        href={`data:image/jpeg;base64, ${styledImage}`}
        download
      >
        Download
      </a>
    </div>
  );
};

ImageReceiver.propTypes = {
  styledImage: PropTypes.string,
  inputImage: PropTypes.string,
  currentStyle: PropTypes.string,
  startStyleTransfer: PropTypes.func.isRequired
};

ImageReceiver.defaultProps = {
  styledImage: null,
  inputImage: null,
  currentStyle: null
};

export default ImageReceiver;
