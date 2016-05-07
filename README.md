# node-jwt-simple

[JWT(JSON Web Token)](http://self-issued.info/docs/draft-jones-json-web-token.html) encode and decode module for node.js.

## Install

    $ npm install jwt-simple

## Usage

```javascript
var jwt = require('jwt-simple');
var payload = { foo: 'bar' };
var secret = 'xxx';

// HS256 secrets are typically 128-bit random strings, for example hex-encoded:
// var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex)

// encode
var token = jwt.encode(payload, secret);

// decode
var decoded = jwt.decode(token, secret);
console.log(decoded); //=> { foo: 'bar' }
```

### decode params

```javascript
/*
 * jwt.decode(token, key, noVerify, algorithm)
 */

// decode, by default the signature of the token is verified
var decoded = jwt.decode(token, secret);
console.log(decoded); //=> { foo: 'bar' }

// decode without verify the signature of the token,
// be sure to KNOW WHAT ARE YOU DOING because not verify the signature
// means you can't be sure that someone hasn't modified the token payload
var decoded = jwt.decode(token, secret, true);
console.log(decoded); //=> { foo: 'bar' }

// decode with a specific algorithm (not using the algorithm described in the token payload)
var decoded = jwt.decode(token, secret, false, 'HS256');
console.log(decoded); //=> { foo: 'bar' }
```

### Algorithms

By default the algorithm to encode is `HS256`.

The supported algorithms for encoding and decoding are `HS256`, `HS384`, `HS512` and `RS256`.

```javascript
// encode using HS512
jwt.encode(payload, secret, 'HS512')
```
