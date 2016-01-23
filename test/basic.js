var jwt = require('../index');
var expect = require('expect.js');
var fs = require('fs');

var package = require('../package.json');

describe('jwt', function() {
  it('jwt has `version` property', function() {
    expect(jwt.version).to.be.a('string');
  });

  it('jwt has `encode` method', function() {
    expect(jwt.encode).to.be.a('function');
  });

  it('jwt has `decode` method', function() {
    expect(jwt.decode).to.be.a('function');
  });
});

describe('version', function() {
  it('the version in the library is the same as the one in package.json', function() {
    expect(jwt.version).to.equal(package.version);
  });
});

describe('encode', function() {
  it('encode token', function() {
    var token = jwt.encode({ foo: 'bar' }, 'key');
    expect(token).to.be.a('string');
    expect(token.split('.')).to.have.length(3);
  });

  it('throw an error when the key is missing', function() {
    var fn = jwt.encode.bind(null, { foo: 'bar' });
    expect(fn).to.throwError(/Require key/);
  });

  it('throw an error when the specified algorithm is not supported', function() {
    var fn = jwt.encode.bind(null, { foo: 'bar' }, 'some_key', 'FooBar256');
    expect(fn).to.throwError(/Algorithm not supported/);
  });
});

describe('decode', function() {
  var key = 'key';
  var obj = { foo: 'bar' };
  var token = jwt.encode(obj, key);

  it('decode token', function() {
    var obj2 = jwt.decode(token, key);
    expect(obj2).to.eql(obj);
  });

  it('throw an error when no token is provided', function() {
    var fn = jwt.decode.bind(null, null, key);
    expect(fn).to.throwError(/No token supplied/);
  });

  it('throw an error when the token is not correctly formatted', function() {
    var fn = jwt.decode.bind(null, 'foo.bar', key);
    expect(fn).to.throwError(/Not enough or too many segments/);
  });

  it('throw an error when the specified algorithm is not supported', function() {
    var fn = jwt.decode.bind(null, token, key, false, 'FooBar256');
    expect(fn).to.throwError(/Algorithm not supported/);
  });

  it('throw an error when the signature verification fails', function() {
    var fn = jwt.decode.bind(null, token, 'invalid_key');
    expect(fn).to.throwError(/Signature verification failed/);
  });

  it('throw an error when the token is not yet active (optional nbf claim)', function() {
    var nbf = (Date.now() + 1000) / 1000;
    var token = jwt.encode({ foo: 'bar', nbf: nbf }, key);
    var fn = jwt.decode.bind(null, token, key);
    expect(fn).to.throwError(/Token not yet active/);
  });

  it('throw an error when the token has expired (optional exp claim)', function() {
    var exp = (Date.now() - 1000) / 1000;
    var token = jwt.encode({ foo: 'bar', exp: exp }, key);
    var fn = jwt.decode.bind(null, token, key);
    expect(fn).to.throwError(/Token expired/);
  });

  it('do not throw any error when verification is disabled', function() {
    var obj = { foo: 'bar' };
    var key = 'key';
    var token = jwt.encode(obj, key);
    var fn1 = jwt.decode.bind(null, token, 'invalid_key1');
    var fn2 = jwt.decode.bind(null, token, 'invalid_key2', true);
    expect(fn1).to.throwError(/Signature verification failed/);
    expect(fn2()).to.eql(obj);
  });

  it('decode token given algorithm', function() {
    var obj = { foo: 'bar' };
    var key = 'key';
    var token = jwt.encode(obj, key, 'HS512');
    var obj2 = jwt.decode(token, key, false, 'HS512');
    expect(obj2).to.eql(obj);
    expect(jwt.decode.bind(null, token, key, false, 'HS256')).to.throwError(/Signature verification failed/);
  });

  describe('RS256', function() {
    var obj = { foo: 'bar' };
    var pem = fs.readFileSync(__dirname + '/test.pem').toString('ascii');
    var cert = fs.readFileSync(__dirname + '/test.crt').toString('ascii');
    var alg = 'RS256';

    it('can add jwt header by options.header', function() {
      var token = jwt.encode(obj, pem, alg, {header: {kid: 'keyidX'}});
      var obj2 = jwt.decode(token, cert);
      expect(obj2).to.eql(obj);

      var jwtHeader = token.split('.')[0];
      expect(JSON.parse(base64urlDecode(jwtHeader))).to.eql({typ:'JWT',alg:alg,kid:'keyidX'});
    });


    it('decode token given RS256 algorithm', function() {
      var token = jwt.encode(obj, pem, alg);
      var obj2 = jwt.decode(token, cert);
      expect(obj2).to.eql(obj);
    });

    it('throw an error when the key is invalid', function() {
      var token = jwt.encode(obj, pem, alg);
      var obj2 = jwt.decode(token, cert);
      expect(jwt.decode.bind(null, token, 'invalid_key')).to.throwError();
    });
  });
});

function base64urlDecode(str) {
  return new Buffer(base64urlUnescape(str), 'base64').toString();
}

function base64urlUnescape(str) {
  str += new Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}
