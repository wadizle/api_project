// sends a json object to the client
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// sends a response but no data back to the client
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// sends the files passed in onto the client
const sendFiles = (request, response, files) => {
  respondJSON(request, response, 200, files);
};

// informs the client that a page was not found (404)
const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseObj);
};

module.exports = {
  respondJSON,
  respondJSONMeta,
  sendFiles,
  notFound,
};
