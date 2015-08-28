/**
 * Converts npm registry `byField` response into serialized graph
 */
var fs = require('fs');
var createGraph = require('ngraph.graph');
var tojson = require('ngraph.tojson');
var load = require('./lib/load.js');

var inputFileName = process.argv[2] || './data/byField.in.graph';
console.log('Parsing npm packages file...');
load(inputFileName, function(packages) {
  saveGraph('dependencies', './data/dependenciesGraph.out.graph');
  saveGraph('devDependencies', './data/devDependencies.out.graph');
  saveGraph('allDependencies', './data/allDependencies.out.graph');

  console.log('');
  // Sometimes different graphs have different number of nodes. Why?
  // Turns out some packages declared dependencies on something which already
  // does not exist
  //
  // For example, take a look at https://www.npmjs.com/package/jolokia-client
  // It has dependency on package called ` optimist`
  // Have you noticed extra whitespace    ^ here?
  // That is why graph has different number of nodes
  console.log("All done.");

  return; // public part is done here.

  function saveGraph(kind, fileName) {
    console.log("Saving `" + kind + '` graph as ' + fileName);
    var graph = createGraph({
      uniqueLinkId: false
    });

    packages.forEach(addNode);

    fs.writeFileSync(fileName, tojson(graph));
    console.log("Done. Saved " + graph.getNodesCount() + ' nodes and ' + graph.getLinksCount() + ' edges');
    return;

    function addNode(pkg) {
      graph.addNode(pkg.id, {
        maintainers: pkg.value.maintainers
      });
      var deps = getDpendencies(pkg.value, kind);
      if (deps) {
        Object.keys(deps).forEach(addLink);
      }

      function addLink(key) {
        graph.addLink(pkg.id, key);
      }
    }
  }

  function getDpendencies(pkg, kind) {
    if (kind === 'dependencies') {
      return pkg.dependencies;
    }
    if (kind === 'devDependencies') {
      return pkg.devDependencies;
    }

    var deps = pkg.dependencies || {};
    var devDeps = pkg.devDependencies || {};
    var result = {};
    for (var key in deps) {
      if (deps.hasOwnProperty(key)) {
        result[key] = 1;
      }
    }
    for (key in devDeps) {
      if (devDeps.hasOwnProperty(key)) {
        result[key] = 1;
      }
    }

    return result;
  }
});
