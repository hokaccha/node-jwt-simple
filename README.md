<div align="center">
    <img src="https://jwt.io/assets/logo.svg"><br><br>
</div>

# Welcome
Secure your application in seconds using standardised **JWT-Tokens**. [RFC 7519](https://tools.ietf.org/html/rfc7519)

[![npm version](https://badge.fury.io/js/jwt-simple.svg)](https://badge.fury.io/js/jwt-simple)

## Sample Use-Case
You may use this as an authentication-method for your API: on one route you encode a token, storing the authenticated user (e.g. after checking password and email) in it. On all other routes you check if the token is valid - this indicates that the user once did authenticate himself successfully.

## Installation
    $ npm install jwt-simple

## Usage
### Encoding
Encode a Object into your token - the `jwt.encode` function takes a maximum of 3 parameters:

| Name | Description | Optional? |
| --- | --- | --- |
| payload | the object you want to encode into the token | No |
| secret | you secret | No |
| algorithm | there are 4 different algorithms `HS256`, `HS384`, `HS512` and `RS256` - standard is `HS256` | Yes |

```javascript
var jwt = require('jwt-simple');

// HS256 secrets are typically 128-bit random strings, for example hex-encoded:
var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

var payload = { 'foo': 'bar' };

//create a new token by encoding the payload object into it
var token = jwt.encode(payload, secret);

//encode using HS512
var token = jwt.encode(payload, secret, 'HS512');
```


### Decoding
Decode a Token returning the encoded Object - the `jwt.decode` function takes a maximum of 4 parameters

| Name | Description | Optional? |
| --- | --- | --- |
| token | the token previously generated | No |
| secret | key which previously encoded the token | No |
| noVerify | turn off verification **ON YOUR OWN RISK** | Yes |
| algorithm | select another algorithm. see encode for algorithm options. | Yes, but noVerify must been set before |

```javascript
var jwt = require('jwt-simple');
var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

// decode, by default the signature of the token is verified
var decoded = jwt.decode(token, secret);
console.log(decoded); //-> { foo: 'bar' }

// decode without verify the signature of the token,
// be sure to KNOW WHAT ARE YOU DOING because not verify the signature
// means you can't be sure that someone hasn't modified the token payload
var decoded = jwt.decode(token, secret, true);
console.log(decoded); //-> { foo: 'bar' }

// decode with a specific algorithm (not using the algorithm described in the token payload)
var decoded = jwt.decode(token, secret, false, 'HS256');
console.log(decoded); //-> { foo: 'bar' }
```
