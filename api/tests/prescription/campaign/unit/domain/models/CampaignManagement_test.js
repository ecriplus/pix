import { CampaignManagement } from '../../../../../../src/prescription/campaign/domain/models/CampaignManagement.js';
import { CampaignTypes } from '../../../../../../src/prescription/shared/domain/constants.js';
import { expect } from '../../../../../test-helper.js';

describe('CampaignManagement', function () {
  let input = beforeEach(function () {
    input = {
      id: 1,
      code: 'code',
      name: 'name',
      type: CampaignTypes.PROFILES_COLLECTION,
      idPixLabel: 'idPixLabel',
      idPixType: 'idPixType',
      createdAt: new Date(2020, 10, 23),
      alternativeTextToExternalIdHelpImage: null,
      archivedAt: new Date(2021, 10, 23),
      archivedBy: null,
      assessmentMethod: null,
      deletedAt: null,
      deletedBy: null,
      externalIdHelpImageUrl: null,
      hasParticipation: true,
      creatorId: 123,
      organizationId: 456,
      targetProfileId: 678,
      title: 'title',
      customLandingPageText: 'customLandingPageText',
      customResultPageText: 'customResultPageText',
      customResultPageButtonText: 'customResultPageButtonText',
      customResultPageButtonUrl: 'customResultPageButtonUrl',
      multipleSendings: 'multipleSendings',
      isForAbsoluteNovice: false,
      creatorLastName: 'creatorLastName',
      creatorFirstName: 'creatorFirstName',
      organizationName: 'organizationName',
      targetProfileName: 'targetProfileName',
      ownerLastName: 'ownerLastName',
      ownerFirstName: 'ownerFirstName',
      ownerId: 234,
      shared: 5,
      started: 3,
      completed: 2,
    };
  });

  it('returns correct object including inherited properties', function () {
    const expected = {
      id: 1,
      code: 'code',
      name: 'name',
      type: CampaignTypes.PROFILES_COLLECTION,
      idPixLabel: 'idPixLabel',
      idPixType: 'idPixType',
      createdAt: new Date(2020, 10, 23),
      alternativeTextToExternalIdHelpImage: null,
      archivedAt: new Date(2021, 10, 23),
      archivedBy: null,
      assessmentMethod: null,
      deletedAt: null,
      deletedBy: null,
      externalIdHelpImageUrl: null,
      hasParticipation: true,
      creatorId: 123,
      organizationId: 456,
      targetProfileId: 678,
      title: 'title',
      customLandingPageText: 'customLandingPageText',
      customResultPageText: 'customResultPageText',
      customResultPageButtonText: 'customResultPageButtonText',
      customResultPageButtonUrl: 'customResultPageButtonUrl',
      multipleSendings: 'multipleSendings',
      isForAbsoluteNovice: false,
      creatorLastName: 'creatorLastName',
      creatorFirstName: 'creatorFirstName',
      organizationName: 'organizationName',
      targetProfileName: 'targetProfileName',
      ownerLastName: 'ownerLastName',
      ownerFirstName: 'ownerFirstName',
      ownerId: 234,
      sharedParticipationsCount: 5,
      totalParticipationsCount: 10,
    };

    const campaignManagement = new CampaignManagement(input);

    expect(campaignManagement).to.deep.equal(expected);
  });

  describe('#totalParticipationsCount', function () {
    it('returns total participations count', function () {
      const campaignManagement = new CampaignManagement({
        id: 1,
        name: 'Assessment101',
        shared: 5,
        started: 3,
        completed: 2,
      });

      expect(campaignManagement.totalParticipationsCount).to.equal(10);
    });

    it('returns total participations count when started is undifined', function () {
      const campaignManagement = new CampaignManagement({
        id: 1,
        name: 'Assessment101',
        shared: 5,
        started: undefined,
        completed: 2,
      });

      expect(campaignManagement.totalParticipationsCount).to.equal(7);
    });
  });

  describe('getters', function () {
    describe('isTypeAssessment', function () {
      it('should return true if campaign type is ASSESSMENT', function () {
        const model = new CampaignManagement({ ...input, type: CampaignTypes.ASSESSMENT });
        expect(model.isTypeAssessment).to.be.true;
      });

      it('should return false if campaign type is not ASSESSMENT', function () {
        const model = new CampaignManagement(input);
        expect(model.isTypeAssessment).to.be.false;
      });
    });

    describe('isTypeProfilesCollection', function () {
      it('should return true if campaign type is PROFILES_COLLECTION', function () {
        const model = new CampaignManagement(input);
        expect(model.isTypeProfilesCollection).to.be.true;
      });

      it('should return false if campaign type is not PROFILES_COLLECTION', function () {
        const model = new CampaignManagement({ ...input, type: CampaignTypes.ASSESSMENT });
        expect(model.isTypeProfilesCollection).to.be.false;
      });
    });
  });
});
