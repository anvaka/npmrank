var inputFileName = process.argv[2] || './data/dependenciesGraph.out.graph';
var path = require('path');
var fs = require('fs');

// You'll need to run git clone git@gist.github.com:8e8fa57c7ee1350e3491.git
// in the export folder to get this path:
var outputDir = 'export/8e8fa57c7ee1350e3491';
if (!fs.existsSync(outputDir)) {
  console.log('Gist data not found. Run: ');
  console.log(' git clone git@gist.github.com:8e8fa57c7ee1350e3491.git');
  console.log('and try again');
  process.exit(1);
  return;
}

var count = process.argv[3] || 1000;
var prefix = process.argv[4] || '';
var centrality = require('ngraph.centrality');
var fromjson = require('ngraph.fromjson');
var pagerank = require('ngraph.pagerank');
var hitsrank = require('ngraph.hits');
var fs = require('fs');
var graph = fromjson(fs.readFileSync(inputFileName, 'utf8'));

var dumpTime = (new Date().toUTCString());
saveFile(
  '01.most-dependent-upon.md',
  centrality.degree(graph, 'in'),
  '# Top ' + count + ' most depended-upon packages'
);
saveFile(
  '02.with-most-dependencies.md',
  centrality.degree(graph, 'out'),
  '# Top ' + count + ' packages with most dependencies'
);

saveFile(
  '03.pagerank.md',
  pagerank(graph, 0.85, 1e-10),
  '# Top ' + count + ' packages with highest Pagerank'
);

saveFile(
  '04.hits-rank.md',
  hitsrank(graph),
  '# Top ' + count + ' packages with highest authority in HITS rank',
  hitsSort, hitsPrint
);


function saveFile(fileName, data, header, sort, print) {
  var name = path.join(outputDir, prefix + fileName);
  var fd = fs.openSync(name, 'w')
  fs.writeSync(fd, '* Date: ' +  dumpTime + '\n');
  fs.writeSync(fd, '* Input file: `' + inputFileName + '`\n');
  fs.writeSync(fd, '\n');

  fs.writeSync(fd, header + '\n');

  printTop(fd, data, sort, print);

  fs.writeSync(fd, '\n');
  fs.writeSync(fd, 'Data generated by https://github.com/anvaka/npmrank\n');
  fs.closeSync(fd);
}

return;

function printTop(fd, stats, sort, print) {
  sort = sort || byValue;
  print = print || toLink;
  var allKeys = Object.keys(stats);
  var idx = 0;
  var packages = allKeys.sort(sortProxy)
    .slice(0, Math.min(count, allKeys.length))
    .map(mapProxy)
    .join('\n');

  fs.writeSync(fd, '\n');
  fs.writeSync(fd, packages);
  fs.writeSync(fd, '\n');

  function sortProxy(x, y) {
    return sort(stats, x, y);
  }

  function mapProxy(x) {
    return print(stats, x, idx++);
  }

  function byValue(stats, x, y) {
    return stats[y] - stats[x];
  }

  function toLink(stats, x, idx) {
    return idx + '. [' + x + '](https://www.npmjs.org/package/' + x + ') - ' + stats[x];
  }
}

function hitsSort(stats, x, y) {
  return stats[y].authority - stats[x].authority;
}

function hitsPrint(stats, x, idx) {
  return idx + '. [' + x + '](https://www.npmjs.org/package/' + x + ') - ' + stats[x].authority;
}
