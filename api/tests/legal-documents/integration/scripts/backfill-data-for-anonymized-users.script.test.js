import { BackfillDataForAnonymizedUsersScript } from '../../../../src/legal-documents/scripts/backfill-data-for-anonymized-users.script.js';
import { logger } from '../../../../src/shared/infrastructure/utils/logger.js';
import { databaseBuilder, expect, knex } from '../../../test-helper.js';

describe('Integration | LegalDocuments | Scripts | backfill-data-for-anonymized-users', function () {
  it('backfills acceptedAt in legal document version user acceptances he anonymized users', async function () {
    // given
    const acceptanceDate1 = new Date('2023-03-23T23:23:23Z');
    const acceptanceDate2 = new Date('2022-02-22T22:22:22Z');
    const admin = databaseBuilder.factory.buildUser.withRole();
    const legacyAnonymizedUser1 = databaseBuilder.factory.buildUser({
      firstName: 'Jane',
      hasBeenAnonymised: true,
      hasBeenAnonymisedBy: admin.id,
    });
    const legacyAnonymizedUser2 = databaseBuilder.factory.buildUser({
      firstName: 'John',
      hasBeenAnonymised: true,
      hasBeenAnonymisedBy: admin.id,
    });
    const notAnonymousUser = databaseBuilder.factory.buildUser({
      firstName: 'Jack',
      hasBeenAnonymised: false,
    });
    const documentVersion = databaseBuilder.factory.buildLegalDocumentVersion({
      service: 'pix-app',
      type: 'TOS',
      versionAt: new Date('2022-01-01'),
    });
    databaseBuilder.factory.buildLegalDocumentVersionUserAcceptance({
      userId: legacyAnonymizedUser1.id,
      legalDocumentVersionId: documentVersion.id,
      acceptedAt: acceptanceDate1,
    });
    databaseBuilder.factory.buildLegalDocumentVersionUserAcceptance({
      userId: legacyAnonymizedUser2.id,
      legalDocumentVersionId: documentVersion.id,
      acceptedAt: acceptanceDate2,
    });
    databaseBuilder.factory.buildLegalDocumentVersionUserAcceptance({
      userId: notAnonymousUser.id,
      legalDocumentVersionId: documentVersion.id,
      acceptedAt: acceptanceDate2,
    });
    await databaseBuilder.commit();
    const script = new BackfillDataForAnonymizedUsersScript();

    // when
    await script.handle({ logger, options: { dryRun: false } });

    // then
    const foundUser1Acceptances = await knex('legal-document-version-user-acceptances')
      .where({ userId: legacyAnonymizedUser1.id })
      .first();
    const foundUser2Acceptances = await knex('legal-document-version-user-acceptances')
      .where({ userId: legacyAnonymizedUser2.id })
      .first();
    const foundNonAnonymizedUserAcceptances = await knex('legal-document-version-user-acceptances')
      .where({ userId: notAnonymousUser.id })
      .first();

    expect(foundUser1Acceptances).to.be.undefined;
    expect(foundUser2Acceptances).to.be.undefined;
    expect(foundNonAnonymizedUserAcceptances.acceptedAt.toISOString()).to.deep.equal('2022-02-22T22:22:22.000Z');
  });
});
