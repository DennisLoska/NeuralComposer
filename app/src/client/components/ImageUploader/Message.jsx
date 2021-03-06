import React, { useState } from 'react';
import PropTypes from 'prop-types';

/*
 * Shows a response message depending on the status of the file upload process.
 * It is gonna be rendered above the upload button.
 */
const Message = ({ msg, setMessage }) => {
  const [showMsg, setMsg] = useState('show');
  return (
    <div
      className={`alert ui icon warning message fade ${showMsg}`}
      role="alert"
      style={{ marginTop: 0 }}
    >
      {msg}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        style={{
          backgroundColor: 'inherit',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          right: '10px'
        }}
        onClick={() => {
          setMsg('');
          setMessage('');
        }}
      >
        <span
          aria-hidden="true"
          style={{ backgroundColor: 'inherit', fontSize: '20px' }}
        >
          &times;
        </span>
      </button>
    </div>
  );
};

Message.propTypes = {
  msg: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired
};

export default Message;
