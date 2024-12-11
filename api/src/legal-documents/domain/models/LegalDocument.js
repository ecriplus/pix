import dayjs from 'dayjs';

export class LegalDocument {
  constructor({ id, type, service, versionAt }) {
    this.id = id;
    this.type = type;
    this.service = service;
    this.versionAt = versionAt;
  }

  buildDocumentPath() {
    const service = this.service.toLowerCase();
    const type = this.type.toLowerCase();
    const versionAt = dayjs(this.versionAt).format('YYYY-MM-DD');
    return `${service}-${type}-${versionAt}`;
  }
}
