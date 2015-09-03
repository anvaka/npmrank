module.exports = getTotalDeps;

function getTotalDeps(graph, match, printNames) {
  var dependents = Object.create(null);
  graph.forEachNode(internalMatch);

  var names = Object.keys(dependents);
  console.log('Found ' + names.length + ' matches');

  var globallySeen = Object.create(null);
  names.forEach(computeDeps);

  var results = names.sort(byDeps).map(toPrettyString);

  var grandTotal = Object.keys(globallySeen).length - names.length;

  return {
    grandTotal: grandTotal,
    results: results
  };

  function internalMatch(node) {
    if (match(node)) {
      dependents[node.id] = 0;
    }
  }

  function byDeps(x, y) {
    return dependents[y] - dependents[x];
  }

  function computeDeps(module) {
    var moduleDependents = 0;
    var seen = Object.create(null);
    countInside(module, '');
    dependents[module] = moduleDependents;

    function countInside(name, indent) {
      // globallySeen will give us unique package names at the end
      globallySeen[name] = true;
      // while seen will help us count all transitive dependents of
      // this package. This is not optimal at all but it works
      seen[name] = true;

      if (printNames) {
        console.log(indent + name);
      }

      graph.forEachLinkedNode(name, countDependents);

      function countDependents(other, link) {
        var isDependent = link.toId === name;

        if (isDependent && !seen[link.fromId]) {
          moduleDependents += 1;
          // go up the dependents tree
          countInside(link.fromId, indent + '  ');
        }
      }
    }
  }

  function toPrettyString(x) {
    return 'https://www.npmjs.org/package/' + x + ' - ' + dependents[x];
  }
}
