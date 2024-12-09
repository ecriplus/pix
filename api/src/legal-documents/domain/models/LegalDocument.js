export class LegalDocument {
  static TYPES = {
    TOS: 'TOS',
  };

  static SERVICES = {
    PIX_APP: 'pix-app',
    PIX_ORGA: 'pix-orga',
    PIX_CERTIF: 'pix-certif',
  };

  constructor({ id, type, service, versionAt }) {
    this.id = id;
    this.type = type;
    this.service = service;
    this.versionAt = versionAt;
  }
}
