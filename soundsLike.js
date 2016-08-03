/**
 * Prints all packages that has short Levenshtein distance with a given name
 * E.g.
 *   node soundsLike.js ngraph 1
 *
 * This will print all package names with distance of 1 edits from ngraph:
 *
 * dgraph egraph graph igraph jgraph ograph vgraph wgraph
 *
 * Prerequisites:
 *   run `./01_get_graph.sh` before anything else
 */
var packageName = process.argv[2];

if (!packageName) {
  printUsage();
  process.exit(101);
}

var distance = require('fast-levenshtein');

var inputFileName = './data/byField.in.graph';

// maxDistance is integer value that represents a threshold for Levenshtein's
// distance: Any package name that has Levenshtein distance between `packageName`
// larger than `maxDistance` is ignored.
var maxDistance = parseMaxDistance();

var forEachPackage = require('./lib/forEachPackage.js');
console.log('Reading packages from ' + inputFileName + '...');
forEachPackage(inputFileName, visitPackage);

function visitPackage(pkg) {
  // ignore if this our own package
  if (pkg.id === packageName) return;

  // Otherwise get edit distance between our package and current package
  var diff = distance.get(pkg.id, packageName);

  if (diff <= maxDistance) {
    // found a candidate!
    console.log(pkg.id);
  }
}

function printUsage() {
  console.log('soundsLike.js - prints packages that sounds like a given one');
  console.log('');
  console.log('Usage:');
  console.log('  node soundsLike.js packageName [maxDistance = 2]');
  console.log('');
  console.log('Example:');
  console.log('  node soundsLike.js ngraph 2');
  console.log('');
  console.log('> this will print all package names with distance of 2 edits:');
  console.log('> dgraph egraph graph igraph jgraph ograph vgraph wgraph');
  console.log('');
  console.log('Options:');
  console.log(' maxDistance - Levenshtein distance threshold. Smaller values yield better matches.');
  console.log(' See https://en.wikipedia.org/wiki/Levenshtein_distance for more info');
}

function parseMaxDistance() {
  var maxDistance = process.argv[3];

  if (maxDistance !== undefined) {
    maxDistance = parseInt(maxDistance, 10)
  } else {
    maxDistance = 2
  }

  if (isNaN(maxDistance)) {
    console.log('ERROR: maxDistance is supposed to be a number. Got: ' + process.argv[3])
    console.log('');
    printUsage();
    process.exit(102);
  }

  if (maxDistance < 1) {
    console.log('ERROR: maxDistance value is supposed to be greater than zero')
    console.log('');
    printUsage();
    process.exit(103);
  }

  return maxDistance;
}
