module.exports = load;

var forEachPackage = require('./forEachPackage.js');

function load(fileName, done) {
  var all = [];

  forEachPackage(fileName, savePackage, function () {
    done(all);
  });

  return; // public part is over

  function savePackage(pkg) {
    all.push({
      id: pkg.id,
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
      maintainers: getMaintainers(pkg.maintainers)
    });
    if (all.length % 5000 === 0) console.log('parsed ' + all.length + ' records');
  }
}

function getMaintainers(maintainers) {
  if (maintainers) {
    return maintainers.map(toName);
  }
  return [];
}

function toName(x) {
  return x.name;
}
