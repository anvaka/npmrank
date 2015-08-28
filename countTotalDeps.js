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
var searchQuery = process.argv[2] || '(^lodash[.-])|(^lodash$)';
var graphName = process.argv[3] || './data/dependenciesGraph.out.graph';
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
});

console.log(deps.results);

var grandTotal = deps.grandTotal;

console.log(grandTotal + ' unique packages depend on ' + searchQuery + ' out of total ' + allPackages + ' packages');
console.log('That is ' + (100 * grandTotal / allPackages).toFixed(3) + '%');
