import { MigrateClientApplicationScript } from '../../../../scripts/prod/migrate-client-application.js';
import { cryptoService } from '../../../../src/shared/domain/services/crypto-service.js';
import { expect, knex, sinon } from '../../../test-helper.js';

let logger;

describe('Script | Prod | migrate client application', function () {
  describe('Options', function () {
    it('has the correct options', function () {
      // when
      const script = new MigrateClientApplicationScript();
      const { options, description, permanent } = script.metaInfo;
      expect(permanent).to.be.false;
      expect(description).to.equal(
        'This script will migrate client application from environment variables (config) to database.',
      );
      // then
      expect(options.dryRun).to.deep.include({
        type: 'boolean',
        default: true,
        description: 'when true does not insert to database',
      });
    });
  });

  describe('Handle', function () {
    beforeEach(function () {
      logger = { info: sinon.spy() };
    });

    describe('when dryRun is false', function () {
      it('inserts client application to database', async function () {
        const script = new MigrateClientApplicationScript();

        await script.handle({ options: { dryRun: false }, logger });

        const clientApplications = await knex('client_applications').select('*');
        expect(clientApplications).to.have.lengthOf(4);
        expect(clientApplications[0].clientId).to.equal('test-apimOsmoseClientId');
        await cryptoService.checkPassword({
          password: 'test-apimOsmoseClientSecret',
          passwordHash: clientApplications[0].clientSecret,
        });
        expect(clientApplications[0].scopes).to.deep.equal(['organizations-certifications-result']);
        expect(clientApplications[0].name).to.equal('livretScolaire');
      });

      it('logs progress', async function () {
        const script = new MigrateClientApplicationScript();

        await script.handle({ options: { dryRun: false }, logger });

        expect(logger.info).to.have.callCount(4);
        expect(logger.info).to.have.been.always.calledWith({ event: 'MigrateClientApplicationScript' });
      });
    });

    describe('when dryRun is true', function () {
      it('does not insert any client application to database', async function () {
        const script = new MigrateClientApplicationScript();

        await script.handle({ options: { dryRun: true }, logger });

        const clientApplications = await knex('client_applications').select('*');
        expect(clientApplications).to.have.lengthOf(0);
      });

      it('logs progress', async function () {
        const script = new MigrateClientApplicationScript();

        await script.handle({ options: { dryRun: true }, logger });

        expect(logger.info).to.have.callCount(5);
        expect(logger.info).to.have.been.always.calledWith({ event: 'MigrateClientApplicationScript' });
      });
    });
  });
});
