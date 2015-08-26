var JSONStream = require('JSONStream');
var es = require('event-stream');
var fs = require('fs');
module.exports = load;

function load(path, done) {
  var all = [];
  var parser = JSONStream.parse('rows.*');

  fs.createReadStream(path)
    .pipe(parser)
    .pipe(es.mapSync(function (data) {
      all.push({
        id: data.id,
        value: {
          dependencies: data.value.dependencies,
          devDependencies: data.value.devDependencies
        }
      });
      if (all.length % 5000 === 0) console.log('parsed ' + all.length + ' records');
      return data
    }))
    .on('end', function() {
      done(all);
    });
}
