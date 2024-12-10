import { LegalDocument } from '../../../../src/legal-documents/domain/models/LegalDocument.js';

const buildLegalDocument = function ({
  id = 123,
  type = LegalDocument.TYPES.TOS,
  service = LegalDocument.SERVICES.PIX_APP,
  versionAt = new Date(),
} = {}) {
  return new LegalDocument({
    id,
    type,
    service,
    versionAt,
  });
};

export { buildLegalDocument };
