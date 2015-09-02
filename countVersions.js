var argv = require('minimist')(process.argv.slice(2));
var packageName = argv['_'][0];
if (!packageName) {
  printUsage();
  process.exit(101);
}
var printNames = argv['print-names'];

console.log('Counting packages that depend on ' + packageName + '...');

var inputFileName = './data/byField.in.graph';
var forEachPackage = require('./lib/forEachPackage.js');
var counts = new Map();
forEachPackage(inputFileName, countPackage, printResults);

function countPackage(data) {
  var pkg = data.value;
  // TODO: Should I differentiate between dev vs regular?
  countDependencies(pkg.dependencies, data.id);
  countDependencies(pkg.devDependencies, data.id);
}

function printResults() {
  var results = [];
  var total = 0;
  counts.forEach(function (dependents, version) {
    results.push({
      version: version,
      dependents: dependents
    });
    if (Array.isArray(dependents)) total += dependents.length;
    else total += dependents;
  });

  results.sort(byDependents)

  console.log(results);
  console.log('');
  console.log('Total (dev + regular) dependents: ' + total);
}

function byDependents(x, y) {
  if (printNames) {
    return y.dependents.length - x.dependents.length;
  }

  return y.dependents - x.dependents;
}

function countDependencies(dependencies, currentPackage) {
  if (!dependencies) return;

  Object.keys(dependencies).forEach(function(dependencyName) {
    if (dependencyName === packageName) {
      var pkgVersion = dependencies[dependencyName];
      increaseCounter(pkgVersion, currentPackage);
    }
  });
}

function increaseCounter(version, currentPackage) {
  // we will either increase a number or record current package name into
  // associated array. This behavior is driven by --print-names argument
  var versionCounter = counts.get(version);
  if (!versionCounter) {
    versionCounter = printNames ? [ currentPackage ] : 1;
    counts.set(version, versionCounter);
  } else {
    if (printNames) {
      versionCounter.push(currentPackage);
    } else {
      counts.set(version, versionCounter + 1);
    }
  }
}

function printUsage() {
  console.log('countVersions.js - counts all packages in npm registry that depend on `packageName`');
  console.log('');
  console.log('Usage:');
  console.log('  node countVersions.js packageNamei [options]');
  console.log('');
  console.log('Options:');
  console.log(' --print-names [false] - print dependent package name');
}
