#!/bin/sh
cd "$(dirname "$0")"
curl https://skimdb.npmjs.com/registry/_design/scratch/_view/byField > ./data/byField.in.graph
node saveStats.js ./data/dependenciesGraph.out.graph 1000
cd ./export/8e8fa57c7ee1350e3491
git add .
git commit -m 'Updating snapshot'
git push
