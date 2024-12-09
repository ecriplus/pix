import { LegalDocument } from '../../../../../src/legal-documents/domain/models/LegalDocument.js';
import { usecases } from '../../../../../src/legal-documents/domain/usecases/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

const { TOS } = LegalDocument.TYPES;
const { PIX_ORGA } = LegalDocument.SERVICES;

describe('Integration | Legal documents | Domain | Use case | accept-legal-document-by-user-id', function () {
  it('accepts the lastest legal document version for a user', async function () {
    // given
    const user = databaseBuilder.factory.buildUser();
    databaseBuilder.factory.buildLegalDocumentVersion({
      type: TOS,
      service: PIX_ORGA,
      versionAt: new Date('2021-01-01'),
    });
    const document = databaseBuilder.factory.buildLegalDocumentVersion({ type: TOS, service: PIX_ORGA });
    await databaseBuilder.commit();

    // when
    await usecases.acceptLegalDocumentByUserId({ userId: user.id, type: TOS, service: PIX_ORGA });

    // then
    const userAcceptance = await knex('legal-document-version-user-acceptances')
      .where('userId', user.id)
      .where('legalDocumentVersionId', document.id)
      .first();
    expect(userAcceptance).to.exist;
  });

  context('when the legal document is the Terms of Service for Pix Orga', function () {
    it('accepts the Pix Orga CGUs in the legacy and legal document model', async function () {
      // given
      const user = databaseBuilder.factory.buildUser({ pixOrgaTermsOfServiceAccepted: false });
      databaseBuilder.factory.buildLegalDocumentVersion({ type: TOS, service: PIX_ORGA });

      await databaseBuilder.commit();

      // when
      await usecases.acceptLegalDocumentByUserId({ userId: user.id, type: TOS, service: PIX_ORGA });

      // then
      const updatedUser = await knex('users').where('id', user.id).first();
      expect(updatedUser.pixOrgaTermsOfServiceAccepted).to.equal(true);
    });

    it('logs an error, when no legal document is found', async function () {
      // given
      const user = databaseBuilder.factory.buildUser({ pixOrgaTermsOfServiceAccepted: false });
      const loggerStub = { warn: sinon.stub() };
      await databaseBuilder.commit();

      // when
      await usecases.acceptLegalDocumentByUserId({ userId: user.id, type: TOS, service: PIX_ORGA, logger: loggerStub });

      // then
      expect(loggerStub.warn).to.have.been.calledWith(
        `No legal document found for type: ${TOS} and service: ${PIX_ORGA}`,
      );
    });
  });
});
