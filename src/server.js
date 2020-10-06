const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const query = require('querystring');
const formidable = require('formidable');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');
const fileLoader = require('./fileLoader.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Called whenever the client makes a request...
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const fileArr = [];
  const params = query.parse(parsedUrl.query);
  let fileName; let
    filePath;
  let form;

  // ensures each url is handled properly
  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response, 200);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/uploadForm':

      // creates a file from the submitted form
      form = formidable.IncomingForm();
      form.uploadDir = __dirname;
      form.parse(request, (err, fields, files) => {
        let { name } = files.filetoupload;
        if (!name) name = 'empty.js';

        // renames the file to what it is supposed to be
        fs.rename(files.filetoupload.path, path.join(__dirname, name), (error) => {
          if (error) {
            responseHandler.respondJSON(request, response, 404, error);
          }
        });
        htmlHandler.getIndex(request, response, 201);
      });
      break;
    case '/getFiles':

      // reads a directory and puts the names of any non javascript files in an array
      // then sends the file names back to the client
      fs.readdir(__dirname, (err, files) => {
        if (err) {
          responseHandler.respondJSON(request, response, 500, err);
        }
        for (let i = 0; i < files.length; i++) {
          if (files[i].split('.')[1] !== 'js') fileArr.push(files[i]);
        }
        if (request.method === 'head') {
          responseHandler.respondJSONMeta(request, response, 204);
        } else {
          responseHandler.sendFiles(request, response, fileArr);
        }
      });
      break;
    case '/downloadFile':
      // downloads a file as specified by the query string
      fileName = params.name;
      filePath = path.join(__dirname, fileName);
      if (request.method === 'head') {
        responseHandler.respondJSONMeta(request, response, 204);
      } else {
        fileLoader.loadFile(request, response, filePath, fileName);
      }
      break;
    default:
      responseHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
