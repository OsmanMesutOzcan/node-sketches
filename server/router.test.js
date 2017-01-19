const assert = require('assert');
const Router = require('./router.js');

let urlPath = '/test';
let filePath = '/test/path.html';
let reqObj = {url: 'http://test.com/test'};

let router;
let resObj;
beforeEach(() => {
  router = Router();

  resObj = {
    writeHead: jest.fn(),
    end: jest.fn()
  };
});
afterEach(() => {router = null; });

describe('addRoute', () => {
  it('has added the given route to the map', () => {
    router.addRoute(urlPath, filePath);

    expect(router.map[urlPath]).toEqual(filePath);
  });

  it('throws an error if the input is bad.', () => {
    const badFilePath = () => router.addRoute(123,filePath);
    const badUrlPath = () => router.addRoute(urlPath, 123);

    expect(badUrlPath).toThrow();
    expect(badFilePath).toThrow();
  });
});

describe('listen', () => {
  it('calls `_notFound` if requested page is not added', () => {
    router._notFound = jest.fn();
    router.listen(reqObj, '/test');

    expect(router._notFound).toHaveBeenCalledTimes(1);
  });

  it('calls `_writeFileToResponse` if req page is added', () => {
    router.addRoute(urlPath, filePath);
    router._writeFileToResponse = jest.fn();
    router.listen(reqObj, '/test');

    expect(router._writeFileToResponse).toHaveBeenCalledTimes(1);
  });
});

describe('_notFound', () => {
  it('writes the correct headers', () => {
    router.listen(reqObj, resObj);

    expect(resObj.writeHead)
      .toHaveBeenCalledWith(404, { 'content-type': 'text/html'});
  });

  it('end the connection calling `res.end()`', () => {
    router.listen(reqObj, resObj);

    expect(resObj.end).toHaveBeenCalled();
  });
});

describe('_writeFileToResponse', () => {
  it('pipes the readStream to response', () => {
    let someFilePath = '/some/file/path';
    let source = { pipe: jest.fn() };
    let fs = { createReadStream: jest.fn(() => source) };
    router._writeFileToResponse(reqObj, resObj, someFilePath, fs);

    expect(fs.createReadStream).toHaveBeenCalledWith(someFilePath);
    expect(source.pipe).toHaveBeenCalledWith(resObj);
  });

  it('writes `200` status to head', () => {
    let someFilePath = '/some/file/path';
    let source = { pipe: jest.fn() };
    let fs = { createReadStream: jest.fn(() => source) };
    router._writeFileToResponse(reqObj, resObj, someFilePath, fs);

    expect(resObj.writeHead).toHaveBeenCalledWith(200);
  });
});
