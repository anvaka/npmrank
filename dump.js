/**
 * Dump keywords and page rank into separate files
 */
var fs = require('fs');
var outFileName = 'online/npmrank.json';

console.log('Collecting tags...');
var collectTags = require('./lib/collectTags.js');
collectTags('./data/byField.in.graph', function(result) {
  var tags = result.tags;
  console.log('Collected ' + result.totalTags + '; Unique tags: ' + result.uniqueTags);

  console.log('Computing page rank...');
  var computePageRank = require('./lib/computePageRank.js');
  var rank = computePageRank('./data/dependenciesGraph.out.graph');
  var keys = Object.keys(rank);
  for (var i = 0; i < keys.length; ++i) {
    rank[keys[i]] = (rank[keys[i]] * 100).toFixed(7);
  }
  console.log('Done');
  console.log('Saving pagerank and tags to ' + outFileName);

  fs.writeFileSync(outFileName, JSON.stringify({
    tags: tags,
    rank: rank
  }));
});
