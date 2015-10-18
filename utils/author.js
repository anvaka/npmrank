module.exports = map;

function map(pkg) {
  var name = pkg.author && pkg.author.name;
  if (typeof name !== 'string') return 'unknown';
  return name;
}
