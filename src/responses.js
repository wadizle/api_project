// const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addUser = (request, response) => {
// const addUser = (request, response, body) => {
  const responseObj = {
    message: 'Name and age are both required',
  };

  // if (!body.name || !body.age) {
  //  responseObj.id = 'missing params';
  //  // return respondJSON(request, response, 400, JSON.stringify(responseObj));
  //  return respondJSON(request, response, 400, responseObj);
  // }
  //
  const responseCode = 201;
  //
  // if (users[body.name]) {
  //  responseCode = 204;
  // } else {
  //  users[body.name] = {};
  //  users[body.name].name = body.name;
  // }
  //
  // users[body.name].age = body.age;
  //
  if (responseCode === 201) {
    responseObj.message = 'Created Successfully!';
    return respondJSON(request, response, responseCode, responseObj);
  }
  //
  return respondJSONMeta(request, response, responseCode);
};

const sendFiles = (request, response, files) => {
  respondJSON(request, response, 200, files);
};

const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseObj);
};

module.exports = {
  addUser,
  sendFiles,
  notFound,
};
