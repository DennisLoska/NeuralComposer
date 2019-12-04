/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const express = require('express');
const artStyles = require('./art_styles.json');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

// Static files
app.use(express.static('dist'));
app.use(express.static('public'));
app.use(express.static('semantic'));

//bodyParser is needed to read the body of a request
app.use(bodyParser.urlencoded({ extended: true }));
//format of the message in the body is expected to be JSONsocket
app.use(bodyParser.json());
//SET STORAGE for /api/upload endpoint
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/input');
  },
  filename: (req, file, cb) => {
    console.log('uploaded ' + file.originalname);
    cb(null, file.originalname);
  }
});
//handling content-type multipart/form-data
const upload = multer({ storage: storage });

//upload endpoint - receives an array of files form the ImageUploader
app.post('/api/inputUpload', upload.array('files'), (req, res) => {
  const files = req.files;
  if (!files) return res.status(400).json({ msg: 'No file uploaded!' });
  else {
    res.status(200).json({
      imgUrl: `images/input/${files[0].filename}`
    });
  }
});

app.post('/api/styleTransfer', (req, res) => {
  const json = req.body;
  if (!json) return res.status(400).json({ msg: 'No Style or input image!' });
  else {
    const styledImage = styleTransfer(json);
    res.status(200).json({
      imgUrl: `images/art/styled/${styledImage}`
    });
  }
});

app.get('/api/getArtStyles', (req, res) => res.send(artStyles));

const styleTransfer = json => {
  //TODO - feed data into model
  return 'styled_vangogh.jpg';
};

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
