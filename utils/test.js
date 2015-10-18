module.exports = map;

function map(pkg) {
  var test = pkg.scripts && pkg.scripts.test;
  if (typeof test !== 'string') return 'undefined';
  return test;
}
