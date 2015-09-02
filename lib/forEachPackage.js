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

  fs.createReadStream(fileName)
    .pipe(parser)
    .pipe(es.mapSync(callback))
    .on('end', done);
}
