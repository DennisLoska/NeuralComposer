import React, { useEffect, useState } from 'react';

// eslint-disable-next-line arrow-parens
const StyleCard = props => {
  const { artist, genre, img_url, styled_img_url } = props.style;
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (props.currentStyle !== artist) setSelected(false);
  });

  const selectStyle = () => {
    setSelected(!isSelected);
    if (!isSelected) props.setCurrentStyle(artist);
    else props.setCurrentStyle(null);
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

export default StyleCard;
