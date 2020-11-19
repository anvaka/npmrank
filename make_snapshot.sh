#!/usr/bin/env zsh
# This package generates data for https://gist.github.com/anvaka/8e8fa57c7ee1350e3491
cd "$(dirname "$0")"
curl --retry 10 https://skimdb.npmjs.com/registry/_design/scratch/_view/byField > ./data/byField.in.graph && \
node --max-old-space-size=4096 ./convertToGraph.js && \
node --max-old-space-size=4096 ./saveStats.js ./data/dependenciesGraph.out.graph 1000 && \
cd ./export/8e8fa57c7ee1350e3491 && \
git add . && \
git commit -m 'Updating snapshot' && \
git push
