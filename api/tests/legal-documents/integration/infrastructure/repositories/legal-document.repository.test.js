import { LegalDocument } from '../../../../../src/legal-documents/domain/models/LegalDocument.js';
import * as legalDocumentRepository from '../../../../../src/legal-documents/infrastructure/repositories/legal-document.repository.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

const { TOS } = LegalDocument.TYPES;
const { PIX_ORGA, PIX_APP } = LegalDocument.SERVICES;

describe('Integration | Legal document | Infrastructure | Repository | legal-document', function () {
  describe('#findLastVersionByTypeAndService', function () {
    it('returns the last legal document version by type and service', async function () {
      // given
      const type = TOS;
      const service = PIX_ORGA;
      databaseBuilder.factory.buildLegalDocumentVersion({
        type,
        service,
        versionAt: new Date('2020-12-01'),
      });
      const expectedDocument = databaseBuilder.factory.buildLegalDocumentVersion({
        type,
        service,
        versionAt: new Date('2024-12-01'),
      });

      databaseBuilder.factory.buildLegalDocumentVersion({
        type,
        service: PIX_APP,
        versionAt: new Date('2024-12-01'),
      });
      await databaseBuilder.commit();

      // when
      const lastDocument = await legalDocumentRepository.findLastVersionByTypeAndService({ type, service });

      // then
      expect(lastDocument).to.deepEqualInstance(domainBuilder.buildLegalDocument(expectedDocument));
    });

    it('returns null when no document found', async function () {
      // when
      const lastDocument = await legalDocumentRepository.findLastVersionByTypeAndService({
        type: 'toto',
        service: 'tutu',
      });

      // then
      expect(lastDocument).to.be.null;
    });
  });
});
