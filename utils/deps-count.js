module.exports = map;

function map(pkg) {
  var deps = pkg.dependencies;
  if (!deps) return 0;
  return Object.keys(deps).length;
}
