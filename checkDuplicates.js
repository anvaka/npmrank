const forEachPackage = require('./lib/forEachPackage');
const inputFileName = process.argv[2] || './data/graph.in';
const seen = new Set();

console.log('Checking duplicate records in ' + inputFileName);

forEachPackage(inputFileName, processPackage, done);

function processPackage(pkg) {
  if (seen.has(pkg.id)) {
    console.log('Duplicate: ', pkg.id);
  } else {
    seen.add(pkg.id);
  }
}

function done() {
  console.log('All done. Processed ' + seen.size + ' packages');
}