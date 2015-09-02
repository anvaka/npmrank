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
      value: {
        dependencies: pkg.value.dependencies,
        devDependencies: pkg.value.devDependencies,
        maintainers: getMaintainers(pkg.value)
      }
    });
    if (all.length % 5000 === 0) console.log('parsed ' + all.length + ' records');
  }
}

function getMaintainers(pkg) {
  if (pkg && pkg.maintainers) {
    return pkg.maintainers.map(toName);
  }
  return [];
}

function toName(x) {
  return x.name;
}
