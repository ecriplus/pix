import { AssessmentParticipationResultFilterError } from '../../../../../../src/prescription/campaign/domain/errors.js';
import { findAssessmentParticipationResultList } from '../../../../../../src/prescription/campaign/domain/usecases/find-assessment-participation-result-list.js';
import { catchErr, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | find-assessment-participation-result-list', function () {
  it('return the assessmentParticipationResultMinimal list', async function () {
    const findPaginatedByCampaignId = sinon.stub();
    const campaignId = 1;
    const filters = Symbol('filters');
    const page = Symbol('page');
    const participations = Symbol('participations');
    findPaginatedByCampaignId.resolves(participations);

    const results = await findAssessmentParticipationResultList({
      campaignId,
      filters,
      page,
      campaignAssessmentParticipationResultListRepository: { findPaginatedByCampaignId },
    });

    expect(findPaginatedByCampaignId).to.have.been.calledWithExactly({ page, campaignId, filters });
    expect(results).to.equal(participations);
  });

  it('throw when filter contain the same id on both badge and unacquiredBadge filters', async function () {
    const campaignId = 1;
    const filters = { unacquiredBadges: [1, 3], badges: [1, 2] };
    const page = Symbol('page');

    const error = await catchErr(findAssessmentParticipationResultList)({
      campaignId,
      filters,
      page,
    });

    expect(error).instanceOf(AssessmentParticipationResultFilterError);
  });
});
