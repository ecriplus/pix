/**
 * Returns the HTTP origin of the given HTTP request headers, based on the x-forwarded-proto and x-forwarded-host headers
 *
 * @param {Object} headers
 * @returns {string} an URL as a string
 */
function getForwardedOrigin(headers) {
  const protoHeader = headers['x-forwarded-proto'];
  const hostHeader = headers['x-forwarded-host'];
  if (!protoHeader || !hostHeader) {
    return '';
  }

  return `${_getHeaderFirstValue(protoHeader)}://${_getHeaderFirstValue(hostHeader)}`;
}

function _getHeaderFirstValue(headerValue) {
  return headerValue.split(',')[0];
}

export { getForwardedOrigin };
