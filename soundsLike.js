/**
 * Prints all packages that has short Levenshtein distance with a given name
 * E.g.
 *   node soundsLike.js ngraph 2
 *
 * This will print all package names with distance of 2 edits from ngraph:
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

var maxDistance = getMaxDistance();

var forEachPackage = require('./lib/forEachPackage.js');
console.log('Reading packages from ' + inputFileName + '...');
forEachPackage(inputFileName, rememberPackage, printResults)

function rememberPackage(pkg) {
  if (pkg.id === packageName) return;

  var diff = distance.get(pkg.id, packageName);
  if (diff < maxDistance) {
    console.log(pkg.id);
  }
}

function printResults() {
}

function printUsage() {
  console.log('soundsLike.js - prints packages that sounds like a given one');
  console.log('');
  console.log('Usage:');
  console.log('  node soundsLike.js packageName [maxDistance = 3]');
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

function getMaxDistance() {
  var maxDistance = process.argv[3];

  if (maxDistance !== undefined) {
    maxDistance = parseInt(maxDistance, 10)
  } else {
    maxDistance = 3
  }

  if (isNaN(maxDistance)) {
    console.log('ERROR: maxDistance is supposed to be a number. Got: ' + process.argv[3])
    console.log('');
    printUsage();
    process.exit(102);
  }

  return maxDistance;
}
