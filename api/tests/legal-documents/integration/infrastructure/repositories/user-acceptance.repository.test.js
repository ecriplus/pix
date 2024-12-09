import { LegalDocument } from '../../../../../src/legal-documents/domain/models/LegalDocument.js';
import * as userAcceptanceRepository from '../../../../../src/legal-documents/infrastructure/repositories/user-acceptance.repository.js';
import { databaseBuilder, expect, knex } from '../../../../test-helper.js';

const { TOS } = LegalDocument.TYPES;
const { PIX_ORGA } = LegalDocument.SERVICES;

describe('Integration | Legal document | Infrastructure | Repository | user-acceptance', function () {
  describe('#create', function () {
    it('creates an acceptance record for a user and legal document', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const document = databaseBuilder.factory.buildLegalDocumentVersion({ type: TOS, service: PIX_ORGA });
      await databaseBuilder.commit();

      // when
      await userAcceptanceRepository.create({ userId: user.id, legalDocumentVersionId: document.id });

      // then
      const userAcceptance = await knex('legal-document-version-user-acceptances')
        .where('userId', user.id)
        .where('legalDocumentVersionId', document.id)
        .first();
      expect(userAcceptance.acceptedAt).to.be.a('date');
    });
  });
});
