import express from 'express';
import path from 'path';


const latest = require("./latest.js");
const app = express();
const serverUrl = 'http://127.0.0.1:';
const serverPort = '3000';


//127.0.0.1:3000/
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

//127.0.0.1:3000/latest
app.get('/latest', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/latest.html'));
});

//127.0.0.1:3000/contact
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/contact.html'));
});

app.use('/image', express.static(__dirname + '/image'));
app.use(express.static(__dirname));

app.listen(3000);

console.log(`Server is up and running in ${serverUrl}${serverPort}`);
