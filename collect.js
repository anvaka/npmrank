var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var npmFileName = './data/byField.in.graph';
assertNpmDownloaded();
// Each collected result will be saved into folder with the same time as modification time
// of the npm file data
var launchTime = getNpmFileTime();

var forEachPackage = require('./lib/forEachPackage.js');
var argv = require('minimist')(process.argv.slice(2));

var utilName = argv['_'][0];
assertUtilExist(utilName);
var utilMap = require(getUtilFile(utilName));

var results = new Map();
var labels = [];
forEachPackage(npmFileName, visit, save);

function visit(record) {
  var key = utilMap(record.value);
  labels.push(record.id);
  var index = labels.length - 1;
  addResult(index, key);
  if (index % 5000 === 0) {
    console.log('processed ' + index + ' records');
  }
}

function addResult(index, key) {
  var array = results.get(key);
  if (array) {
    array.push(index);
  } else {
    results.set(key, [index]);
  }
}

function save() {
  var dirName = getDataFolder();
  console.log('Saving results to ' + dirName);
  ensureOutputFolderExists();
  var labelsFile = path.join(dirName, 'labels.json');
  if (!fs.existsSync(labelsFile)) {
    console.log('Saving labels to ' + labelsFile);
    fs.writeFileSync(labelsFile, JSON.stringify(labels), 'utf8');
  }
  var jsonResult = Object.create(null);
  results.forEach(saveToJSON);
  var utilFile = path.join(dirName, utilName + '.json');
  console.log('Saving results into ' + utilFile);
  fs.writeFileSync(utilFile, JSON.stringify(jsonResult), 'utf8');

  function saveToJSON(v, k) {
    jsonResult[k] = v;
  }
}

function ensureOutputFolderExists() {
  var dirName = getDataFolder();
  mkdirp.sync(dirName);
}

function getDataFolder() {
  var dirName = (launchTime).toISOString().replace(/[:.]/g, '-');
  return path.join(__dirname, 'data', 'collect', dirName);
}

function assertNpmDownloaded() {
  if (!fs.existsSync(npmFileName)) {
    console.log('npm is not downloaded. Make sure to run ./01_get_graph.sh before running this util');
    process.exit(-1);
  }
}

function assertUtilExist(utilName) {
  if (!utilName) {
    printHelp();
    process.exit(-3);
  }

  var fileName = getUtilFile(utilName);
  if (!fs.existsSync(fileName)) {
    console.log('Could not find utility `' + utilName + '` inside `' + fileName + '`.');
    process.exit(-2);
  }
}

function getNpmFileTime() {
  return fs.statSync(npmFileName).mtime;
}

function getUtilFile(utilName) {
  utilName = path.basename(utilName, '.js');
  return path.join(__dirname, 'utils', utilName + '.js');
}

function printHelp() {
  console.log([
    'This utility collects information about all packages within npm repository.',
    '',
    '## Usage:',
    '`node collect UTIL_NAME`',
    '',
    'Where `UTIL_NAME` is a name of the utility, which is executed for each package.',
    '',
    '## Examples:',
    '`node collect license`',
    ' - This will execute a `license` util, which collects license information',
    ' within npm'
  ].join('\n'));
}
