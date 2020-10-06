const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// sends the index to the client
const getIndex = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// sends css to the client
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

module.exports = { getIndex, getCSS };
