const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  notFound: responseHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  // const params = query.parse(parsedUrl.query);
  // const requestType = request.headers.accept.split(',');

  if (request.method === 'POST') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      responseHandler.addUser(request, response, bodyParams);
    });
  } else if (urlStruct[parsedUrl.pathname]) {
    // urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
    urlStruct[parsedUrl.pathname](request, response, request.method);
  } else {
    urlStruct.notFound(request, response);
  }
  // console.dir(parsedUrl);
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
