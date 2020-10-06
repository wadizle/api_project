const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const script = fs.readFileSync(`${__dirname}/../client/filesaver.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

const getScript = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(script);
  response.end();
};

module.exports = { getIndex, getCSS, getScript };
