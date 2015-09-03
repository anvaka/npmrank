/**
 * Counts total dependents for a give search query.
 *
 * Usage:
 *  node countTotalDeps.js "^lodash[.-]"
 *
 * This will find all modules matching `^lodash[.-]` regex, and for each of them
 * will compute all transitive dependents (i.e. dependents of dependents and so on)
 *
 * Prerequisites:
 *  1. Download npm graph with `01_get_graph.sh`
 *  2. Convert it to graph with `node convertToGraph.js`
 */
var fromjson = require('ngraph.fromjson');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var searchQuery = argv['_'][0]; // process.argv[2] || '(^lodash[.-])|(^lodash$)';
var graphName = argv['_'][1] || './data/dependenciesGraph.out.graph';
var printNames = argv['print-names'];

if (!searchQuery) {
  printUsage();
  process.exit(101);
}

var getTotalDeps = require('./lib/getTotalDeps.js');

console.log('Reading graph ' + graphName);
var graph = fromjson(fs.readFileSync(graphName, 'utf8'));
var allPackages = graph.getNodesCount();
console.log('Done. Found ' + allPackages + ' packages');
console.log('Searching modules matching: ' + searchQuery);
var matchRegex = new RegExp(searchQuery);

console.log('Computing transitive dependents for each module');

var deps = getTotalDeps(graph, function match(node) {
  return node.id.match(matchRegex);
}, printNames);

console.log(deps.results);

var grandTotal = deps.grandTotal;

console.log(grandTotal + ' unique packages depend on ' + searchQuery + ' out of total ' + allPackages + ' packages');
console.log('That is ' + (100 * grandTotal / allPackages).toFixed(3) + '%');

function printUsage() {
  console.log('countTotalDeps.js - counts number of transitive dependents for a given search query.');
  console.log('');
  console.log('Usage:');
  console.log('  node countTotalDeps.js searchQuery [graphFileName] [options]');
  console.log('');
  console.log('Options:');
  console.log(' --print-names [false] - print dependent package name');
  console.log('');
  console.log('Examples:');
  console.log('  # print number of packages that transitively depend on lodash or underscore:');
  console.log('  node countTotalDeps.js "^(lodash|underscore)$"');
  console.log('');
  console.log('  # use devDependencies graph for the same query:');
  console.log('  node countTotalDeps.js "^(lodash|underscore)$" ./data/devDependencies.out.graph');
  console.log('');
  console.log('  # Print package names as well:');
  console.log('  node countTotalDeps.js "^(lodash|underscore)$" --print-names');
}
