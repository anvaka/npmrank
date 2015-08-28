/**
 * Counts total dependents of packages created by a single author
 *
 * Usage:
 *  node countTotalDeps.js thlorenz
 *
 * This will find all modules authore by @thlorenz, and for each of them
 * will compute all transitive dependents (i.e. dependents of dependents and so on)
 *
 * Prerequisites:
 *  1. Download npm graph with `01_get_graph.sh`
 *  2. Convert it to graph with `node convertToGraph.js`
 */
var fromjson = require('ngraph.fromjson');
var fs = require('fs');
var author = process.argv[2] || 'thlorenz';
var graphName = process.argv[3] || './data/dependenciesGraph.out.graph';
var getTotalDeps = require('./lib/getTotalDeps.js');

console.log('Reading graph ' + graphName);
var graph = fromjson(fs.readFileSync(graphName, 'utf8'));
var allPackages = graph.getNodesCount();
console.log('Done. Found ' + allPackages + ' packages');
console.log('Searching modules that depend on modules created by ' + author);
console.log('Computing transitive dependents for each module');

var deps = getTotalDeps(graph, function match(node) {
  var maintainers = node.data && node.data.maintainers;
  return maintainers && maintainers.indexOf(author) !== -1;
});

console.log(deps.results);

var grandTotal = deps.grandTotal;

console.log(grandTotal + ' unique packages depend on ' + author + '\'s work (out of total ' + allPackages + ' packages)');
console.log('That is ' + (100 * grandTotal / allPackages).toFixed(3) + '%');
