var prompt = require('prompt');

console.log('Collecting tags...');
var collectTags = require('./lib/collectTags.js');
var result = collectTags('./data/byField.in.graph');
var tags = result.tags;
console.log('Collected ' + result.totalTags + '; Unique tags: ' + result.uniqueTags);


console.log('Computing page rank...');
var computePageRank = require('./lib/computePageRank.js');
var rank = computePageRank('./data/dependenciesGraph.out.graph');
console.log('Done');

prompt.start();
getNextInput();

function getNextInput() {
  prompt.get([{
    description: 'Enter package keyword',
    name: 'keyword'
  }], function (err, result) {
    var matches = (tags[result.keyword] || []).sort(byPagerank);
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
