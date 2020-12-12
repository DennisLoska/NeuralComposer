import React from 'react';

// eslint-disable-next-line arrow-parens
const ImagePlaceholder = props => {
  const placeholders = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < props.amount; i++) {
    placeholders.push(
      <div className="ui inverted card" key={`placeholder-${i}`}>
        <div className="image">
          <div className="ui inverted placeholder">
            <div className="square image" />
          </div>
        </div>
        <div className="content">
          <div className="ui inverted placeholder">
            <div className="header">
              <div className="very short line" />
              <div className="medium line" />
            </div>
            <div className="paragraph">
              <div className="short line" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return placeholders;
};

export default ImagePlaceholder;
