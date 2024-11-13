import { CampaignProfilesCollectionParticipationSummary } from '../../../../../../src/prescription/campaign/domain/read-models/CampaignProfilesCollectionParticipationSummary.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Read-Models | CampaignResults | CampaignProfilesCollectionParticipationSummary', function () {
  describe('constructor', function () {
    it('should correctly initialize the information about campaign participation result', function () {
      // given
      const inputData = {
        firstName: 'Sarah',
        lastName: 'Croche',
        participantExternalId: 'Sarah2024',
        sharedAt: '2024-10-28',
        pixScore: 20,
        sharedProfileCount: 2,
        previousPixScore: null,
        previousSharedAt: null,
        certifiable: true,
        certifiableCompetencesCount: 9,
      };

      // when
      const campaignProfilesCollectionParticipationSummary = new CampaignProfilesCollectionParticipationSummary({
        ...inputData,
        campaignParticipationId: 45,
      });

      // then
      expect(campaignProfilesCollectionParticipationSummary).to.deep.equal({
        id: 45,
        ...inputData,
        evolution: null,
      });
    });

    context('previous participation and evolution', function () {
      // given
      const inputCommonData = {
        campaignParticipationId: 45,
        firstName: 'Sarah',
        lastName: 'Croche',
        participantExternalId: 'Sarah2024',
        certifiable: true,
        certifiableCompetencesCount: 9,
        sharedProfileCount: 2,
      };

      describe('when previous participation pixScore and shared date are undefined', function () {
        it('should return null for the previous pixScore, shared date and evolution', function () {
          // when
          const campaignProfilesCollectionParticipationSummary = new CampaignProfilesCollectionParticipationSummary({
            ...inputCommonData,
            sharedAt: '2024-10-28',
            pixScore: 20,
            previousPixScore: undefined,
            previousSharedAt: undefined,
          });

          // then
          expect(campaignProfilesCollectionParticipationSummary).to.include({
            previousPixScore: null,
            previousSharedAt: null,
            evolution: null,
          });
        });
      });

      describe('when previous participation is 0', function () {
        it('should return 0 for the previous pixScore (and not null)', function () {
          const campaignProfilesCollectionParticipationSummary = new CampaignProfilesCollectionParticipationSummary({
            ...inputCommonData,
            sharedAt: '2024-10-28',
            pixScore: 0,
            previousPixScore: 0,
            previousSharedAt: '2024-10-27',
          });

          expect(campaignProfilesCollectionParticipationSummary).to.include({
            previousPixScore: 0,
          });
        });
      });

      context('evolution compute', function () {
        describe('when pixScore is superior to previous pixScore', function () {
          it('should return "increase" for evolution', function () {
            const campaignProfilesCollectionParticipationSummary = new CampaignProfilesCollectionParticipationSummary({
              ...inputCommonData,
              sharedAt: '2024-10-28',
              pixScore: 20,
              previousPixScore: 10,
              previousSharedAt: '2024-10-27',
            });

            expect(campaignProfilesCollectionParticipationSummary).to.include({
              evolution: 'increase',
            });
          });
        });

        describe('when pixScore is inferior to previous pixScore', function () {
          it('should return decrease for evolution', function () {
            const campaignProfilesCollectionParticipationSummary = new CampaignProfilesCollectionParticipationSummary({
              ...inputCommonData,
              sharedAt: '2024-10-28',
              pixScore: 30,
              previousPixScore: 50,
              previousSharedAt: '2024-10-27',
            });

            expect(campaignProfilesCollectionParticipationSummary).to.include({
              evolution: 'decrease',
            });
          });
        });

        describe('when pixScore is equal to previous pixScore', function () {
          it('should return stable for evolution', function () {
            const campaignProfilesCollectionParticipationSummary = new CampaignProfilesCollectionParticipationSummary({
              ...inputCommonData,
              sharedAt: '2024-10-28',
              pixScore: 30,
              previousPixScore: 30,
              previousSharedAt: '2024-10-27',
            });

            expect(campaignProfilesCollectionParticipationSummary).to.include({
              evolution: 'stable',
            });
          });
        });
      });
    });
  });
});
