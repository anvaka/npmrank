module.exports = map;

function map(pkg) {
  var scripts = pkg.scripts;
  var test = scripts && scripts.test;
  if (typeof test !== 'string') return 'undefined';
  // mocha is crazy popular, but appears in different ways. let's try to detect it:
  if (test.indexOf('mocha') !== -1) return 'mocha';

  return test;
}
