/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line arrow-parens
const StyleCard = props => {
  const { style, currentStyle, setCurrentStyle } = props;
  const { artist, genre, img_url, styled_img_url } = style;
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (currentStyle !== img_url) setSelected(false);
  });

  const selectStyle = () => {
    setSelected(!isSelected);
    if (!isSelected) setCurrentStyle(img_url);
    else setCurrentStyle(null);
  };

  return (
    <div
      className={`style__card ui fluid card ${
        isSelected ? 'style__card--selected' : ''
      }`}
      onClick={selectStyle}
    >
      <div className="ui slide masked reveal image">
        <img
          alt={`${artist} style`}
          src={img_url}
          className="visible content"
          draggable="false"
        />
        <img
          alt="styled demo of labrador"
          src={styled_img_url}
          draggable="false"
          className="hidden content"
        />
      </div>
      <div className="content">
        <h3 className="header">{artist}</h3>
        <div className="meta">
          <span className="date">{genre}</span>
        </div>
      </div>
    </div>
  );
};

StyleCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object.isRequired,
  setCurrentStyle: PropTypes.func.isRequired,
  currentStyle: PropTypes.string
};

StyleCard.defaultProps = {
  currentStyle: null
};

export default StyleCard;
