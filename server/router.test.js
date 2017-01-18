const assert = require('assert');
const router = require('./router.js');

describe('addRoute', () => {

  let urlPath = '/test';
  let filePath = '/test/path.html';

  it('has added the given route to the map', () => {
    let routerMapTest = router();
    routerMapTest.addRoute(urlPath, filePath);

    assert.equal(routerMapTest.map[urlPath], filePath);
  });

  it('throws an error if the input is bad.', () => {
    let routerBadInput = router();
    function badUrlPath() {
      routerBadInput.addRoute(123, filePath);
    }
    assert.throws(badUrlPath);

    function badFilePath() {
      routerBadInput.addRoute(filePath,123);
    }
    assert.throws(badFilePath);
  });
});

describe('listen', () => {
  it.skip('calls `_notFound` if requested page is not on map', () => {
    let routerNotFound = router();
    let reqObj = {url: 'http://test.com/test'};

    // Returns the same value
    routerNotFound._notFound = (arg) => arg;

    assert.equal(routerNotFound.listen(reqObj, '/test'), '/test');
  });
});
