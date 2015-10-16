module.exports = map;

function map(pkg) {
  var deps = pkg.devDependencies;
  if (!deps) return 0;
  return Object.keys(deps).length;
}
