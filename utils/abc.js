module.exports = map;

function map(pkg) {
  var name = pkg.name;
  if (typeof name !== 'string') return 'undefined';
  return name[0];
}
