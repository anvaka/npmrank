var fs = require('fs');
var prompt = require('prompt');
var tags = collectTags();
var rank = computePageRank();

prompt.start();
getNextInput();

function getNextInput() {
  prompt.get(['tag'], function (err, result) {
    var matches = (tags[result.tag] || []).sort(byPagerank);
    console.log('----------------------------------------------------------------------');
    console.log(matches.slice(0, Math.min(20, matches.length)).map(toDisplay).join('\n'));
    getNextInput();
  });
}

function toDisplay(x) {
  return 'https://www.npmjs.com/package/' + x + ' - ' + rank[x];
}

function byPagerank(x, y) {
  return rank[y] - rank[x];
}

function collectTags() {
  console.log('collecting tags');
  var fileName = './data/byField.in.graph';
  var inputFile = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  var packages = inputFile.rows;
  var collectedTags = Object.create(null);
  var totalTags = 0;
  var uniqueTags = 0;
  var empty = [];

  packages.forEach(addNode);
  console.log("Collected " + totalTags + " tags; Unique: " + uniqueTags);
  return collectedTags;

  function addNode(pkg) {
    var id = pkg.id;
    accumulate(pkg.value.tags);
    accumulate(pkg.value.keywords);

    function accumulate(tags) {
      tags = tags || empty;
      if (typeof tags === 'string') {
        tags = tags.split(/[\s,]/g);
      }
      tags.forEach(recordTag);
    }

    function recordTag(tag) {
      if (!tag || tag === '__proto__') {
        return;
      }
      var packages = collectedTags[tag];
      if (!packages) {
        collectedTags[tag] = [id];
        uniqueTags += 1;
      } else {
        packages.push(id);
      }
      totalTags += 1;
    }
  }
}

function computePageRank() {
  console.log('computing page rank');
  var pagerank = require('ngraph.pagerank');
  var fromjson = require('ngraph.fromjson');
  var graph = fromjson(fs.readFileSync('./data/dependenciesGraph.out.graph', 'utf8'));
  return pagerank(graph);
}
