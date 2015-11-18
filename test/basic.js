var jwt = require('../index');
var expect = require('expect.js');
var fs = require('fs');

describe('method and property', function() {
  it('jwt has version property', function() {
    expect(jwt.version).to.be.a('string');
  });

  it('jwt has encode and decode method', function() {
    expect(jwt.encode).to.be.a('function');
    expect(jwt.decode).to.be.a('function');
  });
});

describe('encode and decode', function() {
  it('encode token', function() {
    var token = jwt.encode({ foo: 'bar' }, 'key');
    expect(token).to.be.a('string');
    expect(token.split('.')).to.have.length(3);
  });

  it('key is required', function() {
    var fn = jwt.encode.bind(null, { foo: 'bar' });
    expect(fn).to.throwException();
  });

  it('decode token', function() {
    var obj = { foo: 'bar' };
    var key = 'key';
    var token = jwt.encode(obj, key);
    var obj2 = jwt.decode(token, key);
    expect(obj2).to.eql(obj);
    expect(jwt.decode.bind(null, token, 'invalid_key')).to.throwException();
  });

  it('decode no verify', function() {
    var obj = { foo: 'bar' };
    var key = 'key';
    var token = jwt.encode(obj, key);
    var fn1 = jwt.decode.bind(null, token, null);
    var fn2 = jwt.decode.bind(null, token, null, true);
    expect(fn1).to.throwException();
    expect(fn2()).to.eql(obj);
  });

  it('decode token given algorithm', function() {
    var obj = { foo: 'bar' };
    var key = 'key';
    var token = jwt.encode(obj, key, 'HS512');
    var obj2 = jwt.decode(token, key, false, 'HS512');
    expect(obj2).to.eql(obj);
    expect(jwt.decode.bind(null, token, key, false, 'HS256')).to.throwException();
    expect(jwt.decode.bind(null, token, 'invalid_key')).to.throwException();
  });

  it('RS256', function() {
    var obj = { foo: 'bar' };
    var pem = fs.readFileSync(__dirname + '/test.pem').toString('ascii');
    var cert = fs.readFileSync(__dirname + '/test.crt').toString('ascii');
    var alg = 'RS256';
    var token = jwt.encode(obj, pem, alg);
    var obj2 = jwt.decode(token, cert);
    expect(obj2).to.eql(obj);
    expect(jwt.decode.bind(null, token, 'invalid_key')).to.throwException();
  });

  it('can add jwt header by options.header', function() {
    var obj = { foo: 'bar' };
    var pem = fs.readFileSync(__dirname + '/test.pem').toString('ascii');
    var cert = fs.readFileSync(__dirname + '/test.crt').toString('ascii');
    var alg = 'RS256';
    var token = jwt.encode(obj, pem, alg, {header: {kid: 'keyidX'}});
    var obj2 = jwt.decode(token, cert);
    expect(obj2).to.eql(obj);

    var jwtHeader = token.split('.')[0];
    expect(JSON.parse(base64urlDecode(jwtHeader))).to.eql({typ:"JWT",alg:"RS256",kid:"keyidX"});
  });
});

function base64urlDecode(str) {
  return new Buffer(base64urlUnescape(str), 'base64').toString();
}

function base64urlUnescape(str) {
  str += new Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}
