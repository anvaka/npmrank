# npmrank

This repository computes various graph metrics for npm dependencies.

# sample

Please refer to the [sample](https://github.com/anvaka/npmrank/tree/master/sample)
folder to see output of this application. You can also visit online page to search
packages by keyword and sort results by pagerank: http://anvaka.github.io/npmrank/online/

# local development

Basic setup:

```
git clone https://github.com/anvaka/npmrank.git
cd npmrank
npm install
```

Download the npm graph from npm:

```
./01_get_graph.sh
```

This will download graph from skimdb and save it to `data` folder. As of 
October 2015 this data is about 258MB. Convert it to `ngraph.graph` format
for further analysis:

```
node convertToGraph.js
```

This will produce three new files in the `data` folder. Each file represents
a graph (regular dependencies, devDependencies, and combined of the two).

We are ready to analyze the graphs:

```
node computeStats.js ./data/dependenciesGraph.out.graph 100 > sample/dependencies.md
node computeStats.js ./data/devDependencies.out.graph 100 > sample/devdependencies.md
node computeStats.js ./data/allDependencies.out.graph 100 > sample/alldependencies.md
```

Each of these commands will analyse corresponding graph, and will take top 100
entries in the following metrics:

* [Indegree](https://en.wikipedia.org/wiki/Directed_graph#Indegree_and_outdegree) -
most dependent upon packages
* [Outdegree](https://en.wikipedia.org/wiki/Directed_graph#Indegree_and_outdegree) -
packages with highest number of dependencies.
* [Pagerank](https://en.wikipedia.org/wiki/PageRank) - rough estimate of package
importance, based on number of dependents/dependencies.
* [Hubs and Authorities](https://en.wikipedia.org/wiki/HITS_algorithm) - alternative
importance classification, also based on number of edges.

## Command line usage

The following line will compute number of unique packages, that depend on packages
created and maintained by a given user (in this case it's @thlorenz):

```
node ./countAuthorDeps.js thlorenz
```

You can also counts total dependents for a give search query. E.g. this will
count number of packages that depend on either underscore or lodash:

```
node countTotalDeps.js "^(lodash|underscore)$"
```

NOTE: Total dependents means all transitive dependents as well (i.e. dependents
of dependents, and so on).

# license

MIT
