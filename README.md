# npmrank

This repository computes various graph metrics for npm dependencies.

# setup

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

You are ready to analyze the graph.

## Graph metrics: PageRank, HITS, and Node Degree

```
node computeStats.js ./data/dependenciesGraph.out.graph 100 > sample/dependencies.md
node computeStats.js ./data/devDependencies.out.graph 100 > sample/devdependencies.md
node computeStats.js ./data/allDependencies.out.graph 100 > sample/alldependencies.md
```

These commands analyze and print top 100 entries for the following metrics:

* [Indegree](https://en.wikipedia.org/wiki/Directed_graph#Indegree_and_outdegree) -
most dependent upon packages. [Demo](https://github.com/anvaka/npmrank/blob/master/sample/dependencies.md#top-100-most-dependent-upon-packages)
* [Outdegree](https://en.wikipedia.org/wiki/Directed_graph#Indegree_and_outdegree) -
packages with highest number of dependencies. [Demo](https://github.com/anvaka/npmrank/blob/master/sample/dependencies.md#top-100-packages-with-most-dependencies)
* [Pagerank](https://en.wikipedia.org/wiki/PageRank) - rough estimate of package
importance, based on number of dependents/dependencies. [Demo](https://github.com/anvaka/npmrank/blob/master/sample/dependencies.md#top-100-packages-with-highest-pagerank)
* [Hubs and Authorities](https://en.wikipedia.org/wiki/HITS_algorithm) - alternative
importance classification, also based on number of edges. [Demo](https://github.com/anvaka/npmrank/blob/master/sample/dependencies.md#top-100-packages-with-highest-authority-in-hits-rank)

## Command line usage

The following line will compute number of unique packages, that depend on packages
created and maintained by a given user (in this case it's @thlorenz):

```
node ./countAuthorDeps.js thlorenz
```

You can also counts total dependents for a given search query. E.g. this will
count number of packages that depend on either underscore or lodash:

```
node countTotalDeps.js "^(lodash|underscore)$"
```

*NOTE*: Total dependents means all transitive dependents as well (i.e. dependents
of dependents, and so on).

To count which versions depend on your package you can use `countVersions.js`
utility:

```
node countVersions.js jquery
```

To get list of packages grouped by version pass `--print-names` argument:

```
node countVersions.js ngraph.graph --print-names
```

## Online

Discover relevant and popular packages quickly: http://anvaka.github.io/npmrank/online/
Select a keyword and get packages sorted by their pagerank value.

Metrics dump with all graphs is available [here](https://github.com/anvaka/npmrank/tree/master/sample).

# license

MIT
