# Welcome
Secure your application in seconds using standardised **JWT-Tokens**. [RFC 7519](https://tools.ietf.org/html/rfc7519)

[![npm version](https://badge.fury.io/js/jwt-simple.svg)](https://badge.fury.io/js/jwt-simple)

## Sample Use-Case
You may use this as an authentication-method for your API: on one route you encode a token, storing the authenticated user (e.g. after checking password and email) in it. On all other routes you check if the token is valid - this indicates that the user once did authenticate himself successfully.

## Installation
    $ npm install jwt-simple

## Usage
### Encoding Data and Creating a new Token
```javascript
var jwt = require('jwt-simple');

// HS256 secrets are typically 128-bit random strings, for example hex-encoded:
var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

var payload = { 'foo': 'bar' };

//create a new token by encoding the payload object into it
var token = jwt.encode(payload, secret);
```



### Decoding the Token to the Encoded Object
```javascript
var jwt = require('jwt-simple');
var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

var payload = jwt.decode(token, secret);
console.log(payload); //-> { 'foo': 'bar' }

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
