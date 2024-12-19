import { LegalDocumentService } from '../../../../src/legal-documents/domain/models/LegalDocumentService.js';
import { LegalDocumentType } from '../../../../src/legal-documents/domain/models/LegalDocumentType.js';
import { ConvertUsersOrgaCguData } from '../../../../src/legal-documents/scripts/convert-users-orga-cgu-data.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

const { TOS } = LegalDocumentType.VALUES;
const { PIX_ORGA } = LegalDocumentService.VALUES;

describe('Integration | Legal documents | Scripts | convert-users-orga-cgu-data', function () {
  describe('Options', function () {
    it('has the correct options', function () {
      // given
      const script = new ConvertUsersOrgaCguData();

      // when
      const { options, permanent } = script.metaInfo;

      // then
      expect(permanent).to.be.false;
      expect(options).to.deep.include({
        dryRun: {
          type: 'boolean',
          describe: 'Executes the script in dry run mode',
          default: false,
        },
        batchSize: {
          type: 'number',
          describe: 'Size of the batch to process',
          default: 1000,
        },
        throttleDelay: {
          type: 'number',
          describe: 'Delay between batches in milliseconds',
          default: 300,
        },
      });
    });
  });

  describe('#handle', function () {
    let clock;
    let legalDocumentVersion;
    let logger;

    beforeEach(async function () {
      clock = sinon.useFakeTimers({ now: new Date('2024-01-01'), toFake: ['Date'] });
      legalDocumentVersion = databaseBuilder.factory.buildLegalDocumentVersion({ type: TOS, service: PIX_ORGA });
      logger = { info: sinon.stub() };
    });

    afterEach(async function () {
      clock.restore();
    });

    it('converts Pix Orga user cgus to legal document user acceptances', async function () {
      // given
      const userAcceptedCgu = databaseBuilder.factory.buildUser({
        pixOrgaTermsOfServiceAccepted: true,
        lastPixOrgaTermsOfServiceValidatedAt: new Date('2021-01-01'),
      });
      const userAcceptedCguWithoutDate = databaseBuilder.factory.buildUser({
        pixOrgaTermsOfServiceAccepted: true,
        lastPixOrgaTermsOfServiceValidatedAt: null,
      });
      const userNotAcceptedCgu = databaseBuilder.factory.buildUser({
        pixOrgaTermsOfServiceAccepted: false,
        lastPixOrgaTermsOfServiceValidatedAt: null,
      });
      await databaseBuilder.commit();

      // when
      const script = new ConvertUsersOrgaCguData();
      const options = { dryRun: false, batchSize: 1, throttleDelay: 0 };
      await script.handle({ options, logger });

      // then
      expect(logger.info).to.have.been.calledWith('Batch #1');
      expect(logger.info).to.have.been.calledWith('Batch #2');
      expect(logger.info).to.have.been.calledWith('Total users migrated: 2');

      const userAcceptances = await knex('legal-document-version-user-acceptances').where({
        legalDocumentVersionId: legalDocumentVersion.id,
      });

      const acceptance1 = userAcceptances.find((user) => user.userId === userAcceptedCgu.id);
      expect(acceptance1.acceptedAt).to.deep.equal(new Date('2021-01-01'));

      const acceptance2 = userAcceptances.find((user) => user.userId === userAcceptedCguWithoutDate.id);
      expect(acceptance2.acceptedAt).to.deep.equal(new Date('2024-01-01'));

      const acceptance3 = userAcceptances.find((user) => user.userId === userNotAcceptedCgu.id);
      expect(acceptance3).to.be.undefined;
    });

    context('when a user cgu is already converted to legal document user acceptances', function () {
      it('does not change already converted user acceptances', async function () {
        // given
        const alreadyConvertedUser = databaseBuilder.factory.buildUser({
          pixOrgaTermsOfServiceAccepted: true,
          lastPixOrgaTermsOfServiceValidatedAt: new Date('2021-01-01'),
        });
        const newUserAcceptedCgu = databaseBuilder.factory.buildUser({
          pixOrgaTermsOfServiceAccepted: true,
          lastPixOrgaTermsOfServiceValidatedAt: new Date('2021-01-01'),
        });
        databaseBuilder.factory.buildLegalDocumentVersionUserAcceptance({
          legalDocumentVersionId: legalDocumentVersion.id,
          userId: alreadyConvertedUser.id,
          acceptedAt: new Date('2020-01-01'),
        });
        await databaseBuilder.commit();

        // when
        const script = new ConvertUsersOrgaCguData();
        const options = { dryRun: false, batchSize: 1, throttleDelay: 0 };
        await script.handle({ options, logger });

        // then
        expect(logger.info).to.have.been.calledWith('Total users migrated: 1');

        const userAcceptances = await knex('legal-document-version-user-acceptances').where({
          legalDocumentVersionId: legalDocumentVersion.id,
        });

        const acceptance1 = userAcceptances.find((user) => user.userId === alreadyConvertedUser.id);
        expect(acceptance1.acceptedAt).to.deep.equal(new Date('2020-01-01'));

        const acceptance2 = userAcceptances.find((user) => user.userId === newUserAcceptedCgu.id);
        expect(acceptance2.acceptedAt).to.deep.equal(new Date('2021-01-01'));
      });
    });

    context('when the script has the dry run mode', function () {
      it('does not create legal document user acceptance', async function () {
        // given
        databaseBuilder.factory.buildUser({
          pixOrgaTermsOfServiceAccepted: true,
          lastPixOrgaTermsOfServiceValidatedAt: new Date('2021-01-01'),
        });
        await databaseBuilder.commit();

        // when
        const script = new ConvertUsersOrgaCguData();
        const options = { dryRun: true, batchSize: 1, throttleDelay: 0 };
        await script.handle({ options, logger });

        // then
        expect(logger.info).to.have.been.calledWith('Batch #1');
        expect(logger.info).to.have.been.calledWith('Total users to migrate: 1');

        const userAcceptances = await knex('legal-document-version-user-acceptances').where({
          legalDocumentVersionId: legalDocumentVersion.id,
        });
        expect(userAcceptances.length).to.equal(0);
      });
    });

    context('when no legal document is found', function () {
      it('throws an error', async function () {
        // given
        const script = new ConvertUsersOrgaCguData();

        // when / then
        const options = { dryRun: true, batchSize: 1, throttleDelay: 0 };
        await expect(script.handle({ options, logger })).to.be.rejectedWith(
          'No legal document found for type: TOS, service: pix-orga',
        );
      });
    });
  });
});
