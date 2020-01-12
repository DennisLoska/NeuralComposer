/* eslint-disable spaced-comment */
/* eslint-disable arrow-parens */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const rp = require('request-promise');
const fs = require('fs').promises;
const artStyles = require('./art_styles.json');

const app = express();

// Static files
app.use(express.static(__dirname + '/../../dist'));
app.use(express.static(__dirname + '/../../public'));
app.use(express.static(__dirname + '/../../semantic'));

//bodyParser is needed to read the body of a request
app.use(bodyParser.urlencoded({ extended: true }));
//format of the message in the body is expected to be JSONsocket
app.use(bodyParser.json());
//SET STORAGE for /api/upload endpoint
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '../../../public/images/input/');
  },
  filename: (req, file, cb) => {
    console.log(`uploaded ${file.originalname}`);
    cb(null, file.originalname);
  }
});
//handling content-type multipart/form-data
const upload = multer({ storage });

//upload endpoint - receives an array of files form the ImageUploader
app.post('/api/inputUpload', upload.array('files'), (req, res) => {
  const { files } = req;
  if (!files) res.status(400).json({ msg: 'No file uploaded!' });
  else {
    res.status(200).json({
      imgUrl: `images/input/${files[0].filename}`
    });
  }
});

/*
 * Encodes the input and style image to base64
 * and formats it as a base64 string.
 *
 */
const base64Encode = async file => {
  const path = `${__dirname}/../../public/${file}`;
  let encoded;
  try {
    encoded = await fs.readFile(path, { encoding: 'base64' });
  } catch (error) {
    console.log(error);
  }
  return encoded.toString('base64');
};


/*
 * Creates the paylod for the POST request
 * to the Flask server.
 *
 */
const createOptions = async images => {
  let input;
  let style;
  try {
    input = await base64Encode(images.input);
    style = await base64Encode(images.style);
  } catch (error) {
    console.log(error);
  }
  const options = {
    method: 'POST',
    uri: 'http://localhost:4002/styleTransfer',
    body: {input, style},
    json: true
  };
  return options;
};

/*
 * Makes the POST request to the Flask server and
 * receives the response.
 *
 */
const styleTransfer = async images => {
  let options;
  try {
    options = await createOptions(images);
  } catch (error) {
    console.log(error);
  }
  return rp(options)
    .then(response => response)
    .catch(error => {
      console.log(error);
    });
};

/*
 * This function receives the urls for the input
 * and style image from the React client and returns
 * the generated style image and evolutions, once it
 * is available.
 *
 */
app.post('/api/styleTransfer', async (req, res) => {
  const json = req.body;
  if (!json) res.status(400).json({ msg: 'No Style or input image!' });
  else {
    //styledImage is a base64 image
    const style = await styleTransfer(json);
    res.status(200).json({
      imgUrl: style.image,
      imgList: style.list
    });
  }
});

// Simply returns the content of the art_styles.json file.
app.get('/api/getArtStyles', (req, res) => res.send(artStyles));

app.listen(process.env.PORT || 4001 , () =>
  console.log(`Listening on port ${process.env.PORT || 4001 }!`)
);
