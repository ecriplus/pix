import * as campaignMediaComplianceService from '../../../../../../src/prescription/campaign/domain/services/campaign-media-compliance-service.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Service | Campaign media compliance service ', function () {
  describe('#getMediaCompliance', function () {
    let campaign, targetProfile, targetProfileAdministrationRepository, tubeRepository;

    beforeEach(function () {
      targetProfile = domainBuilder.buildTargetProfile();
      campaign = domainBuilder.buildCampaignToJoin();
      campaign.targetProfileId = targetProfile.id;

      targetProfileAdministrationRepository = {
        getTubesByTargetProfileId: sinon.stub(),
      };
      tubeRepository = {
        findActiveByRecordIds: sinon.stub(),
      };
    });

    describe('when every tubes are tablet and mobile compliant', function () {
      it('should return "isTabletCompliant" and "isMobileCompliant" truthy values', async function () {
        // given
        const tubes = [
          domainBuilder.buildTube({ id: 'recTube123', isMobileCompliant: true, isTabletCompliant: true }),
          domainBuilder.buildTube({ id: 'recTube234', isMobileCompliant: true, isTabletCompliant: true }),
        ];
        targetProfileAdministrationRepository.getTubesByTargetProfileId
          .withArgs(campaign.targetProfileId)
          .resolves(tubes.map((tube) => ({ tubeId: tube.id })));
        tubeRepository.findActiveByRecordIds.withArgs(['recTube123', 'recTube234'], 'fr').resolves(tubes);

        // when
        const { isMobileCompliant, isTabletCompliant } = await campaignMediaComplianceService.getMediaCompliance(
          campaign,
          'fr',
          {
            targetProfileAdministrationRepository,
            tubeRepository,
          },
        );

        // then
        expect(isMobileCompliant).to.be.true;
        expect(isTabletCompliant).to.be.true;
      });
    });

    describe('when every tubes are tablet compliant only', function () {
      it('should return "isTabletCompliant" and "isMobileCompliant" truthy values', async function () {
        // given
        const tubes = [
          domainBuilder.buildTube({ id: 'recTube123', isMobileCompliant: false, isTabletCompliant: true }),
          domainBuilder.buildTube({ id: 'recTube234', isMobileCompliant: true, isTabletCompliant: true }),
        ];
        targetProfileAdministrationRepository.getTubesByTargetProfileId
          .withArgs(campaign.targetProfileId)
          .resolves(tubes.map((tube) => ({ tubeId: tube.id })));
        tubeRepository.findActiveByRecordIds.withArgs(['recTube123', 'recTube234'], 'fr').resolves(tubes);

        // when
        const { isMobileCompliant, isTabletCompliant } = await campaignMediaComplianceService.getMediaCompliance(
          campaign,
          'fr',
          {
            targetProfileAdministrationRepository,
            tubeRepository,
          },
        );

        // then
        expect(isMobileCompliant).to.be.false;
        expect(isTabletCompliant).to.be.true;
      });
    });

    describe('when every tubes are mobile compliant only', function () {
      it('should return "isTabletCompliant" and "isMobileCompliant" truthy values', async function () {
        // given
        const tubes = [
          domainBuilder.buildTube({ id: 'recTube123', isMobileCompliant: true, isTabletCompliant: false }),
          domainBuilder.buildTube({ id: 'recTube234', isMobileCompliant: true, isTabletCompliant: true }),
        ];
        targetProfileAdministrationRepository.getTubesByTargetProfileId
          .withArgs(campaign.targetProfileId)
          .resolves(tubes.map((tube) => ({ tubeId: tube.id })));
        tubeRepository.findActiveByRecordIds.withArgs(['recTube123', 'recTube234'], 'fr').resolves(tubes);

        // when
        const { isMobileCompliant, isTabletCompliant } = await campaignMediaComplianceService.getMediaCompliance(
          campaign,
          'fr',
          {
            targetProfileAdministrationRepository,
            tubeRepository,
          },
        );

        // then
        expect(isMobileCompliant).to.be.true;
        expect(isTabletCompliant).to.be.false;
      });
    });

    describe('when every tubes are not all mobile and tablet compliant', function () {
      it('should return "isTabletCompliant" and "isMobileCompliant" truthy values', async function () {
        // given
        const tubes = [
          domainBuilder.buildTube({ id: 'recTube123', isMobileCompliant: true, isTabletCompliant: false }),
          domainBuilder.buildTube({ id: 'recTube234', isMobileCompliant: false, isTabletCompliant: true }),
        ];
        targetProfileAdministrationRepository.getTubesByTargetProfileId
          .withArgs(campaign.targetProfileId)
          .resolves(tubes.map((tube) => ({ tubeId: tube.id })));
        tubeRepository.findActiveByRecordIds.withArgs(['recTube123', 'recTube234'], 'fr').resolves(tubes);

        // when
        const { isMobileCompliant, isTabletCompliant } = await campaignMediaComplianceService.getMediaCompliance(
          campaign,
          'fr',
          {
            targetProfileAdministrationRepository,
            tubeRepository,
          },
        );

        // then
        expect(isMobileCompliant).to.be.false;
        expect(isTabletCompliant).to.be.false;
      });
    });
  });
});
