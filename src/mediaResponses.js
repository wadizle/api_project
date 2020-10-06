const fs = require('fs');
const path = require('path');

// I'm not sure I love the way I split the functions but it works decently
const getPositions = (request, stats) => {
  let { range } = request.headers;

  if (!range) {
    range = 'bytes=0-';
  }

  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);

  const total = stats.size;
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  if (start > end) {
    start = end - 1;
  }

  return {
    start,
    end,
    total,
  };
};

const createHeadObject = (response, start, end, total, chunksize, contentType) => ({
  'Content-Range': `bytes ${start}-${end}/${total}`,
  'Accept-Ranges': 'bytes',
  'Content-Length': chunksize,
  'Content-Type': contentType,
});

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

const determineMimeType = (fileName) => {
  let type = 'undefined';
  let extension = fileName.split('.')[1];
  extension = extension.toLowerCase();
  console.log(extension);
  switch (extension.toLowerCase()) {
    case 'docx':
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
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
    case 'pptx':
      type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case 'svg':
      type = 'image/svg+xml';
      break;
    case 'ttf':
      type = 'font/ttf';
      break;
    case 'txt':
      type = 'text/plain';
      break;
    case 'wav':
      type = 'audio/wav';
      break;
    case 'xlsx':
      type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    default:
      type = 'undefined';
  }

  return type;
};

const loadFile = (request, response, filePath, fileName) => {
  const file = path.resolve(__dirname, filePath);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
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
