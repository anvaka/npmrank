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
# Warning: this seem to be not working anymore. npm removed the endpoint
# to download the graph. If you know alternative - please share
./01_get_graph.sh
```

This will download graph from skimdb and save it to `data` folder. As of 
September 2016 this data is about 500MB. Convert it to `ngraph.graph` format
for further analysis:

```
node --max-old-space-size=4096 convertToGraph.js
```

You are ready to analyze the graph.

## Graph metrics: PageRank, HITS, and Node Degree

```
node --max-old-space-size=4096 computeStats.js ./data/dependenciesGraph.out.graph 100 > sample/dependencies.md
node --max-old-space-size=4096 computeStats.js ./data/devDependencies.out.graph 100 > sample/devdependencies.md
node --max-old-space-size=4096 computeStats.js ./data/allDependencies.out.graph 100 > sample/alldependencies.md
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
node --max-old-space-size=4096 ./countAuthorDeps.js thlorenz
```

You can also count total dependents for a given search query. E.g. this will
count number of packages that depend on either underscore or lodash:

```
node --max-old-space-size=4096 countTotalDeps.js "^(lodash|underscore)$"
```

*NOTE*: Total dependents means all transitive dependents as well (i.e. dependents
of dependents, and so on).

To count which versions depend on your package you can use `countVersions.js`
utility:

```
node --max-old-space-size=4096 countVersions.js jquery
```

To get list of packages grouped by version pass `--print-names` argument:

```
node --max-old-space-size=4096 countVersions.js ngraph.graph --print-names
```

To further narrow down this list and print only those deps that could receive
a certain semver range, pass --semver argument. E.g.:

```
node --max-old-space-size=4096 countVersions.js lodash --semver='3.9.x'
```

### Searching for packages that sounds like a given name

```
node --max-old-space-size=4096 soundsLike.js packageName [maxDistance=3]
```

Where

```
packageName [required] - name that you are investigating
maxDistance [optional, defaults to 2] - Levenshtein distance threshold. Smaller
 values yield better matches.
```

Examples:

``` shell
# will find `digraph, mongraph, graph, egraph, ...`
node soundsLike.js ngraph

# this will narrow down results to edit distance 1
# `graph, egraph, ...`:
node soundsLike.js ngraph 1
```

## Online

Discover relevant and popular packages quickly: https://anvaka.github.io/npmrank/online/
Select a keyword and get packages sorted by their pagerank value.

Metrics dump with all graphs is available [here](https://gist.github.com/anvaka/8e8fa57c7ee1350e3491).

# license

MIT
