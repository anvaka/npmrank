module.exports = map;

function map(pkg) {
  var scripts = pkg.scripts;
  if (!scripts) return undefined;
  return scripts.test;
}
