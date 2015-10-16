module.exports = map;

function map(pkg) {
  var name = pkg.license;
  return (typeof name === 'string') ?  name : 'unknown';
}
