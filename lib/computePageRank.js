var pagerank = require('ngraph.pagerank');
var fromjson = require('ngraph.fromjson');
var fs = require('fs');

module.exports = computePageRank;

function computePageRank(fileName) {
  var graph = fromjson(fs.readFileSync(fileName, 'utf8'));
  return pagerank(graph);
}
