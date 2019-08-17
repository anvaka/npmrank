const registry = require('package-stream')()
const JSONStream = require('JSONStream');
const fs = require('fs');
const outFileName = './data/graph.in';

const outgoing = JSONStream.stringify(false);
  var fileStream = fs.createWriteStream(outFileName, {
    encoding: 'utf8',
    flags: 'a'
  });
  outgoing.pipe(fileStream);
let found = 0;

registry
  .on('package', function (pkg, seq) {
    let packageNode = {
      id: pkg.name
    };
    if (pkg.dependencies) {
      packageNode.dependencies = pkg.dependencies;
    }
    if (pkg.devDependencies) {
      packageNode.devDependencies = pkg.devDependencies;
    }
    const maintainers = pkg.other && pkg.other.maintainers;
    if (maintainers) {
      packageNode.maintainers = maintainers;
    }
    outgoing.write(packageNode)
    found += 1;
    if (found % 15000 === 0) console.log('Processed ' + found);
  })
  .on('up-to-date', function () {
    // consumed all changes (for now)
    // The stream will remain open and continue receiving package
    // updates from the registry as they occur in real time.
    console.log('All done. Found ' + found + 'packages');
    process.exit(0)
  }) 
