/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Progress from './Progress';
import Message from './Message';

const ImageUploader = props => {
  const [state, setState] = useState({
    files: [],
    filenames: []
  });
  const [uploadPercentage, setPercent] = useState(0);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [placeholder, setPlaceholder] = useState('Upload an .jpg or .png file');

  /*
   * Updates the state of the file and filename, when a file is selected from the disk.
   */
  const onChange = e => {
    const { files } = e.target;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      setState(prevState => ({
        files: [...prevState.files, files[i]],
        filenames: [...prevState.filenames, files[i].name]
      }));
    }
  };

  const handleApiError = error => {
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('ServerError', error.message);
    }
  };

  /*
   * sends an API request to the server and updates the progress bar
   * based on the axios progressEvent
   */
  const uploadFile = async (formData, callback) => {
    const res = await axios
      .post('/api/inputUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => callback(progressEvent)
      })
      .catch(error => handleApiError(error));
    setResponse(res);
    props.setUploaded(res.data.imgUrl);
  };

  /*
   * The uploadFile action creator invokes a callback which you can see here. In that
   callback the axios progressEvent is being used to update the local state with the
   percentage of the upload process. Also a timeout is being set to reset the progress
   baer after 10 seconds again.
   */
  const uploadSpec = async formData => {
    await uploadFile(formData, progressEvent => {
      if (state.files.length > 0) {
        setPercent(
          // eslint-disable-next-line radix
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
        // Clear percentage
        setTimeout(() => {
          setPercent(0);
          setState({
            filenames: [],
            files: []
          });
        }, 10000);
      }
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      state.files.map(file => formData.append('files', file));
      await uploadSpec(formData);
      setMessage('File(s) successfully uploaded!');
    } catch (error) {
      console.log(error);

      if (error.response.status === 500) {
        setMessage('There was a problem with the server');
      }
      setMessage(error.response.data.msg);
    }
  };

  const { files, filenames } = state;

  return (
    <div className="column">
      <h3 className="row__headline ui inverted header">Input image</h3>
      {!response && (
        <form onSubmit={onSubmit} id="upload-form">
          <div className="ui placeholder segment custom__uploader">
            <div className="ui icon header">
              <i className="file outline icon" />
              {filenames.length > 0
                ? filenames.map(name => `${name}, `)
                : placeholder}
            </div>
            {files.length === 0 ? (
              <>
                <input
                  type="file"
                  className="custom__uploader-input"
                  name="files"
                  id="customFile"
                  multiple
                  onChange={onChange}
                />

                <div className="ui primary button">
                  <label htmlFor="customFile">Upload</label>
                </div>
              </>
            ) : null}
            {files.length > 0 && (
              <input
                type="submit"
                value="Upload"
                className="button__input ui primary button"
              />
            )}
          </div>
          <Progress percentage={uploadPercentage} />
          {message ? <Message msg={message} setMessage={setMessage} /> : null}
        </form>
      )}
      {response && (
        <div className="ui placeholder segment">
          <img
            className="ui fluid image"
            src={response.data.imgUrl}
            draggable={false}
            alt="input"
          />
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  setUploaded: PropTypes.func.isRequired
};

export default ImageUploader;
