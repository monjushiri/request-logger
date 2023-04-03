var fs = require('fs');
var util = require('util');

var log_stdout = process.stdout;

var log_file;
log_file = fs.createWriteStream(__dirname + `/${new Date().getTime()}.json`, { flags: 'w' });

var first_log = true;

function echo_log_write(d) {
  if (typeof log_file !== 'undefined') {
    log_file.write(d);
  }
}

function echo_log(d) {
  if (first_log) {
    echo_log_write('[\n' + util.format(d));
    first_log = false;
  } else {
    echo_log_write(',\n' + util.format(d));
  }
}

console.log = function (d) { //
  echo_log(d);
  log_stdout.write(util.format(d) + '\n');
};

const http = require('http');

const hostname = '0.0.0.0';
const default_port = 8765;

const server = http.createServer((req, res) => {
  req_log = {};
  req_log['method'] = req.method;
  req_log['url'] = req.url;
  req_log['headers'] = req.headers;

  req.on("data", function (chunk) {
    req_log['body'] = JSON.parse(chunk);
  });

  req.on('end', function () {
    console.log(JSON.stringify(req_log));
  });

  res.statusCode = 200;
  res.end();
});

server.listen(port = process.env.ECHO_SERVER_PORT ? parseInt(process.env.ECHO_SERVER_PORT) : default_port, hostname, () => {
  log_stdout.write(util.format(`Server running at http://localhost:${port}/`) + '\n\n');
});

server.on('close', function () {
  log_stdout.write('\n' + util.format('Server stopped') + '\n');
  if (!first_log) {
    echo_log_write('\n]');
  }
});

process.on('SIGINT', function () {
  server.close();
});