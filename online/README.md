# npm packages PageRank

[This online demo](http://anvaka.github.io/npmrank/online/) allows you to search
npm packages by keyword and then sorts the results according to their PageRank:

[![Demo](https://raw.githubusercontent.com/anvaka/npmrank/master/online/images/demo.png)](http://anvaka.github.io/npmrank/online/)

PageRank is computed based on npm dependencies graph (do not confuse with Google's
web pages PageRank).

# How exactly does this work?

## What is PageRank?

Let's start with brief introduction into PageRank. PageRank is a node ranking
algorithm which assigns each node in the graph a number. Since this algorithm
was created by Google, this number answers a simple question: "What is
the probability of a user visiting page `A`". If node `A` has PageRank `0.1`, then
the probability of a user visiting page `A` is `10%`.

## How is it related to npm?

npm packages and their dependencies can be viewed as graph. Packages are nodes,
and dependencies are edges. Since PageRank is a very generic algorithm we can
compute score of each package. In the npm world the PageRank would answer the
question: "What is the probability of your package depend on package `A`".

This has an interesting implication, that you can find popular or important packages
easily.

## The workflow

The npm keywords database and graph's PageRank is computed offline. First, I
[download](../01_get_graph.sh) the entire catalogue of npm packages, using
`skimdb.npmjs.com`. This is ~410MB of data. Then I [convert](../convertToGraph.js)
the raw response into [`ngraph.graph`](https://github.com/anvaka/ngraph.graph) instance.
Finally, [these 26 lines of code](../dump.js) collect all tags, compute pagerank,
and dump results into json file.

When you search something [on the website](http://anvaka.github.io/npmrank/online/)
I'm making lookup in the tags database, and then sort each matching package by
their PageRank score.

# Improvements/TODO

Initial results are not bad, but far from being perfect. There are several ways
to improve it, so your contribution is very welcomed here!

1. Instead of search by keywords only, it's worth to look at `readme` and `description`
fields as well.
2. Explore [topic-sensitive PageRank](https://en.wikipedia.org/wiki/Topic-Sensitive_PageRank)
for each keyword.
3. This is my first [react](https://github.com/facebook/react) application and
I know it is ugly. Feel free to send PR with improvements.
