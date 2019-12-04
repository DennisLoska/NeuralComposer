/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const express = require('express');
const artStyles = require('./art_styles.json');

const app = express();

app.use(express.static('public'));

app.get('/api/getArtStyles', (req, res) => res.send(artStyles));

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
