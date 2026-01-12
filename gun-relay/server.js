const Gun = require('gun');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Gun Relay Running'));

const server = app.listen(port, () => console.log('Server listening on', port));

Gun({ web: server });

