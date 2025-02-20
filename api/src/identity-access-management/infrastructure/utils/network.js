const PIX_APP_APPLICATION_NAME = 'app';
const PIX_ADMIN_APPLICATION_NAME = 'admin';
const PIX_ORGA_APPLICATION_NAME = 'orga';
const PIX_CERTIF_APPLICATION_NAME = 'certif';
const PIX_JUNIOR_APPLICATION_NAME = 'junior';

const localhostApplicationPortMapping = {
  4200: PIX_APP_APPLICATION_NAME,
  4201: PIX_ORGA_APPLICATION_NAME,
  4202: PIX_ADMIN_APPLICATION_NAME,
  4203: PIX_CERTIF_APPLICATION_NAME,
  4205: PIX_JUNIOR_APPLICATION_NAME,
};

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

class RequestedApplication {
  /**
   * @param {string} applicationName
   */
  constructor(applicationName) {
    this.applicationName = applicationName;
  }

  get isPixApp() {
    return this.applicationName == PIX_APP_APPLICATION_NAME;
  }

  get isPixAdmin() {
    return this.applicationName == PIX_ADMIN_APPLICATION_NAME;
  }

  get isPixOrga() {
    return this.applicationName == PIX_ORGA_APPLICATION_NAME;
  }

  get isPixCertif() {
    return this.applicationName == PIX_CERTIF_APPLICATION_NAME;
  }

  get isPixJunior() {
    return this.applicationName == PIX_JUNIOR_APPLICATION_NAME;
  }

  /**
   * @param {string} origin an URL like https://app.pix.fr, https://orga.pix.fr, https://app-pr10823.review.pix.fr, http://localhost:4200, etc.
   * @returns {RequestedApplication}
   */
  static fromOrigin(origin) {
    const url = new URL(origin);
    let applicationName;

    if (url.hostname == 'localhost') {
      applicationName = localhostApplicationPortMapping[url.port];
      return new RequestedApplication(applicationName);
    }

    const urlFirstLabel = url.hostname.split('.')[0];
    const reviewAppSubPart = urlFirstLabel.split('-')[0];
    applicationName = reviewAppSubPart;
    return new RequestedApplication(applicationName);
  }
}

function _getHeaderFirstValue(headerValue) {
  return headerValue.split(',')[0];
}

export { getForwardedOrigin, RequestedApplication };
