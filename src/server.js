const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const query = require('querystring');
const formidable = require('formidable');
// const express = require('express');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');
const fileHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// const urlStruct = {
//  '/': htmlHandler.getIndex,
//  '/style.css': htmlHandler.getCSS,
//  notFound: responseHandler.notFound,
// };

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  // const params = query.parse(parsedUrl.query);
  // const requestType = request.headers.accept.split(',');

  if (request.method === 'POST') {
    const form = formidable.IncomingForm();
    form.uploadDir = __dirname;
    form.parse(request, (err, fields, files) => {
      // console.log('uploaded file');
      // console.log(files);
      // const obj = {name : files.filetoupload.name};//, path1 : oldPath, path2 : newPath};

      fs.rename(files.filetoupload.path, path.join(__dirname, files.filetoupload.name), (error) => {
        if (error) console.log(error);
        // ADD RESPONSE
      });

      // responseHandler.respondJSON(request, response, 201, obj);
      htmlHandler.getIndex(request, response);

      // fs.rename(oldPath, newPath, (error) => {
      //  if (error) console.log(error);
      //  // ADD RESPONSE
      // });
    });
  } else if (parsedUrl.pathname === '/getFiles') {
    const fileArr = [];
    fs.readdir(path.join(__dirname, ''), (err, files) => {
    // fs.readdir(__dirname, (err, files) => {
      if (err) {
        console.log(err);
        // ADD RESPONSE
      }
      for (let i = 0; i < files.length; i++) {
        if (files[i].split('.')[1] !== 'js') fileArr.push(files[i]);
      }
      responseHandler.sendFiles(request, response, fileArr);
    });
  } else if (parsedUrl.pathname === '/downloadFile') {
    const params = query.parse(parsedUrl.query);
    const fileName = params.name;
    const filePath = path.join(__dirname, fileName);
    fileHandler.loadFile(request, response, filePath, fileName);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/filesaver.js') {
    htmlHandler.getScript(request, response);
  } else {
    // urlStruct.notFound(request, response);
    responseHandler.notFound(request, response);
  }

//  if (request.method === 'POST') {
//    const body = [];
//
//    request.on('error', (err) => {
//      console.dir(err);
//      response.statusCode = 400;
//      response.end();
//    });
//
//    request.on('data', (chunk) => {
//      body.push(chunk);
//    });
//
//    request.on('end', () => {
//      const bodyString = Buffer.concat(body).toString();
//      const bodyParams = query.parse(bodyString);
//
//      responseHandler.addUser(request, response, bodyParams);
//    });
//  } else if (urlStruct[parsedUrl.pathname]) {
//    // urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
//    urlStruct[parsedUrl.pathname](request, response, request.method);
//  } else {
//    urlStruct.notFound(request, response);
//  }
  // console.dir(parsedUrl);
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
