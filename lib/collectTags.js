var forEachPackage = require('./forEachPackage.js');
module.exports = collectTags;

function collectTags(fileName, done) {
  var collectedTags = Object.create(null);
  var totalTags = 0;
  var uniqueTags = 0;
  var empty = [];
  forEachPackage(fileName, addNode, function() {
    done({
      tags: collectedTags,
      totalTags: totalTags,
      uniqueTags: uniqueTags
    })
  });

  return;

  function addNode(pkg) {
    var id = pkg.id;
    accumulate(pkg.value.tags);
    accumulate(pkg.value.keywords);

    function accumulate(tags) {
      tags = tags || empty;
      if (typeof tags === 'string') {
        tags = tags.split(/[\s,]/g);
      }
      tags.forEach(recordTag);
    }

    function recordTag(tag) {
      if (!tag || tag === '__proto__') {
        // '__proto__' doesn't make some pacakges happy
        return;
      }
      tag = tag.toLowerCase();
      var packages = collectedTags[tag];
      if (!packages) {
        collectedTags[tag] = [id];
        uniqueTags += 1;
      } else {
        packages.push(id);
      }
      totalTags += 1;
    }
  }
}
