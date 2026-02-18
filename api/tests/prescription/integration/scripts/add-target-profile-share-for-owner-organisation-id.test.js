import { AddTargetProfileShareOnOwnerOrganizationId } from '../../../../src/prescription/scripts/add-target-profile-share-for-owner-organisation-id.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

const { buildTargetProfile, buildTargetProfileShare, buildOrganization } = databaseBuilder.factory;

describe('Integration | Prescription | Scripts | add-target-profile-share-for-owner-organisation-id', function () {
  let script;
  let logger;

  beforeEach(function () {
    script = new AddTargetProfileShareOnOwnerOrganizationId();
    logger = {
      info: sinon.stub(),
      debug: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub(),
    };
  });

  describe('options', function () {
    it('should have the correct options', function () {
      const { options } = script.metaInfo;

      expect(options.dryRun).to.deep.include({
        type: 'boolean',
        describe: 'Run the script without making any database changes',
        default: true,
      });
    });
  });

  describe('#handle', function () {
    describe('when target profile does not have ownerOrganizationId', function () {
      it('should do nothing', async function () {
        // given
        const targetProfileId = buildTargetProfile({ ownerOrganizationId: null }).id;
        await databaseBuilder.commit();

        const options = {
          dryRun: false,
        };

        // when
        await script.handle({ logger, options });

        // then
        const targetProfileShares = await knex('target-profile-shares').where({ targetProfileId });
        expect(targetProfileShares).lengthOf(0);
      });

      it('should not remove older target profile shares', async function () {
        // given
        const organizationId = buildOrganization().id;
        const targetProfileId = buildTargetProfile({ ownerOrganizationId: null }).id;

        buildTargetProfileShare({ organizationId, targetProfileId });
        await databaseBuilder.commit();

        const options = {
          dryRun: false,
        };

        // when
        await script.handle({ logger, options });

        // then
        const targetProfileShares = await knex('target-profile-shares').where({ targetProfileId, organizationId });
        expect(targetProfileShares).lengthOf(1);
      });
    });

    describe('when target profile have ownerOrganizationId', function () {
      it('should not insert data on dryRun true', async function () {
        // given
        const organizationId = buildOrganization().id;
        const targetProfileId = buildTargetProfile({ ownerOrganizationId: organizationId }).id;
        await databaseBuilder.commit();

        const options = {
          dryRun: true,
        };

        // when
        await script.handle({ logger, options });

        // then
        const targetProfileShares = await knex('target-profile-shares').where({ targetProfileId, organizationId });
        expect(targetProfileShares).lengthOf(0);
      });

      it('should insert ownerOrganizationId targetProfileShare line', async function () {
        // given
        const organizationId = buildOrganization().id;
        const targetProfileId = buildTargetProfile({ ownerOrganizationId: organizationId }).id;
        await databaseBuilder.commit();

        const options = {
          dryRun: false,
        };

        // when
        await script.handle({ logger, options });

        // then
        const targetProfileShares = await knex('target-profile-shares').where({ targetProfileId, organizationId });
        expect(targetProfileShares).lengthOf(1);
      });

      it('should do nothing if ownerOrganization is already registered ', async function () {
        // given
        const organizationId = buildOrganization().id;
        const targetProfileId = buildTargetProfile({ ownerOrganizationId: organizationId }).id;

        buildTargetProfileShare({ organizationId, targetProfileId });
        await databaseBuilder.commit();

        const options = {
          dryRun: false,
        };

        // when
        await script.handle({ logger, options });

        // then
        const targetProfileShares = await knex('target-profile-shares').where({ targetProfileId, organizationId });
        expect(targetProfileShares).lengthOf(1);
      });

      it('should not insert organizationId on another targetProfile', async function () {
        // given
        const organizationId = buildOrganization().id;
        const targetProfileId = buildTargetProfile({ ownerOrganizationId: organizationId }).id;
        const otherTargetProfileId = buildTargetProfile({ ownerOrganizationId: null }).id;

        buildTargetProfileShare({ organizationId, targetProfileId });
        await databaseBuilder.commit();

        const options = {
          dryRun: false,
        };

        // when
        await script.handle({ logger, options });

        // then
        const targetProfileShares = await knex('target-profile-shares').where({
          targetProfileId: otherTargetProfileId,
        });
        expect(targetProfileShares).lengthOf(0);
      });
    });
  });
});
