import { CampaignParticipantActivity } from '../../../../../../src/prescription/campaign/domain/read-models/CampaignParticipantActivity.js';
import { CampaignParticipationStatuses } from '../../../../../../src/prescription/shared/domain/constants.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Read-Models | CampaignResults | CampaignParticipantActivity', function () {
  describe('constructor', function () {
    it('should correctly initialize the information about campaign participant activity', function () {
      const campaignParticipantActivity = new CampaignParticipantActivity({
        organizationLearnerId: 12,
        campaignParticipationId: 45,
        firstName: 'Lidia',
        lastName: 'Aguilar',
        participantExternalId: 'Alba67',
        status: CampaignParticipationStatuses.TO_SHARE,
        participationCount: null,
      });

      expect(campaignParticipantActivity).to.deep.equal({
        organizationLearnerId: 12,
        firstName: 'Lidia',
        lastName: 'Aguilar',
        participantExternalId: 'Alba67',
        status: 'STARTED',
        lastCampaignParticipationId: 45,
        participationCount: 0,
      });
    });
  });
});
