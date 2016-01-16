/**
 * Specific error for Json Web Token. 
 * @param  {String} message 
 * @param  {Object} error
 */
var jwtError = function (message, error) {
  this.error = {
  	name: 'JsonWebTokenError',
  	message: message,
  };
  if (error) this.error.inner = error;
};

jwtError.prototype.constructor = jwtError;

module.exports = jwtError;
