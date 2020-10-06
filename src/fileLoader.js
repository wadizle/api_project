const fs = require('fs');
const path = require('path');

// getting the positions of the start/end of the data from stats
const getPositions = (request, stats) => {
  let { range } = request.headers;

  if (!range) {
    range = 'bytes=0-';
  }

  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);
  let total = stats.size;
  let end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  if (start > end) {
    start = end - 1;
  }

  if (total < 0) total = 0;
  if (start < 0) start = 0;
  if (end < 0) end = 0;

  return {
    start,
    end,
    total,
  };
};

// creates an object to be passed as a header
const createHeadObject = (response, start, end, total, chunksize, contentType) => ({
  'Content-Range': `bytes ${start}-${end}/${total}`,
  'Accept-Ranges': 'bytes',
  'Content-Length': chunksize,
  'Content-Type': contentType,
});

// creates the file stream to be read
const createStream = (file, start, end, response) => {
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

// a brute force way of determining the mime type of a file
const determineMimeType = (fileName) => {
  let type = 'undefined';
  let extension = fileName.split('.')[1];
  extension = extension.toLowerCase();
  switch (extension.toLowerCase()) {
    case 'gif':
      type = 'image/gif';
      break;
    case 'mp3':
      type = 'audio/mpeg';
      break;
    case 'mpeg':
      type = 'video/mpeg';
      break;
    case 'png':
      type = 'image/png';
      break;
    case 'pdf':
      type = 'application/pdf';
      break;
    case 'svg':
      type = 'image/svg+xml';
      break;
    case 'txt':
      type = 'text/plain';
      break;
    case 'wav':
      type = 'audio/wav';
      break;
    default:
      type = 'undefined';
  }

  return type;
};

// loads a file using the other functions in the file
const loadFile = (request, response, filePath, fileName) => {
  const file = path.resolve(__dirname, filePath);

  fs.stat(file, (err, stats) => {
    if (err) {
      response.writeHead(400);
      response.write(JSON.stringify(err));
      return response.end();
    }

    const positions = getPositions(request, stats);
    const { start } = positions;
    const { end } = positions;
    const { total } = positions;
    const chunksize = (end - start) + 1;

    const contentType = determineMimeType(fileName);

    response.writeHead(206, createHeadObject(response, start, end, total, chunksize, contentType));

    return createStream(file, start, end, response);
  });
};

module.exports.loadFile = loadFile;
