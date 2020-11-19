/**
 * Prints packages most commonly used with a given one
 *
 * Usage:
 *   node what.common.js <package name>
 *
 * Example:
 *   node what.common.js react-dom
 */
var argv = require('minimist')(process.argv.slice(2));

var packageName = argv['_'][0];
if (!packageName) {
  printUsage();
  process.exit(101);
}

console.log('Counting packages most commonly used with ' + packageName + '...');

var inputFileName = './data/byField.in.graph';
var forEachPackage = require('./lib/forEachPackage.js');
var counts = new Map();
forEachPackage(inputFileName, countPackage, printResults);

function countPackage(data) {
  var pkg = data.value;
  countDependencies(pkg.dependencies, data.id);
  countDependencies(pkg.devDependencies, data.id);
}

function countDependencies(dependencies, currentPackage) {
  if (!dependencies) return;
  var hasCurrentPackage = false;
  var deps = new Set();
  Object.keys(dependencies).forEach(function(dependencyName) {
    if (dependencyName === packageName) {
      hasCurrentPackage = true;
    } else {
      // add only those that do not equal to the current package
      deps.add(dependencyName);
    }
  });

  // Merge to global counter
  if (hasCurrentPackage) {
    deps.forEach(function(x) {
      if (counts.has(x)) {
        counts.set(x, counts.get(x) + 1);
      } else {
        counts.set(x, 1);
      }
    });
  }
}

function printResults() {
  var counter = [];
  counts.forEach(function(v, key) {
    counter.push({numberOfTimes: v, package: key});
  });
  counter = counter.sort(function(x, y) { return y.numberOfTimes - x.numberOfTimes; }).map(
    function(x) {
      return x.package + ' used ' + x.numberOfTimes + ' times';
    }
  );
  console.log('Found ' + counter.length + ' packages most commonly used with ' + packageName + ':');
  console.log(counter);
}

function printUsage() {
  console.log('what.common.js - prints packages that most often appear with a given one');
  console.log('');
  console.log('Usage:');
  console.log('  node what.common.js <package name>');
  console.log('');
  console.log('Example:');
  console.log(' node what.common.js react-dom');
}
