/**
 * Iterate over raw response from `byField` endpoint and call a callbacke
 * for each package
 */
module.exports = forEachPackage;

var JSONStream = require('JSONStream');
var es = require('event-stream');
var fs = require('fs');

function forEachPackage(fileName, callback, done) {
  var parser = JSONStream.parse('rows.*');

  if (!done) done = noop;

  if (!fs.existsSync(fileName)) {
    throw new Error(
      'Could not find npm file: ' + fileName + '. Did you forget to run ./01_get_graph.sh?'
    );
  }
  fs.createReadStream(fileName)
    .pipe(parser)
    .pipe(es.mapSync(callback))
    .on('end', done);
}

function noop() { }
