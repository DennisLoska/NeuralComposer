import React from 'react';

// eslint-disable-next-line arrow-parens
const ImageLoader = props => {
  let placeholders = [];

  for (let i = 0; i < props.amount; i++) {
    placeholders.push(
      <div className="ui inverted card" key={`placeholder-${i}`}>
        <div className="image">
          <div className="ui inverted placeholder">
            <div className="square image"></div>
          </div>
        </div>
        <div className="content">
          <div className="ui inverted placeholder">
            <div className="header">
              <div className="very short line"></div>
              <div className="medium line"></div>
            </div>
            <div className="paragraph">
              <div className="short line"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return placeholders;
};

export default ImageLoader;
