import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import getCombinedCoursesByOrganizationId from '../../../../../src/quest/domain/usecases/get-combined-courses-by-organization-id.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Usecases | getCombinedCoursesByOrganizationId', function () {
  it('should return combined courses with their participations', async function () {
    // given
    const organizationId = 123;

    const combinedCourse1 = new CombinedCourse({
      id: 1,
      name: 'Combined Course 1',
      code: '1',
      organizationId,
      questId: 1,
    });
    const combinedCourse2 = new CombinedCourse({
      id: 2,
      name: 'Combined Course 2',
      code: '2',
      organizationId,
      questId: 2,
    });
    const participation1 = new CombinedCourseParticipation({ id: 1, questId: 1, organizationLearnerId: 1 });
    const participation2 = new CombinedCourseParticipation({ id: 2, questId: 1, organizationLearnerId: 2 });
    const participation3 = new CombinedCourseParticipation({ id: 3, questId: 2, organizationLearnerId: 3 });

    const combinedCourseRepositoryStub = {
      findByOrganizationId: sinon.stub().resolves([combinedCourse1, combinedCourse2]),
    };
    const combinedCourseParticipationRepositoryStub = {
      findByCombinedCourseIds: sinon.stub().resolves([participation1, participation2, participation3]),
    };

    // when
    const result = await getCombinedCoursesByOrganizationId({
      organizationId,
      combinedCourseRepository: combinedCourseRepositoryStub,
      combinedCourseParticipationRepository: combinedCourseParticipationRepositoryStub,
    });

    // then
    expect(combinedCourseRepositoryStub.findByOrganizationId).to.have.been.calledOnceWithExactly({ organizationId });
    expect(combinedCourseParticipationRepositoryStub.findByCombinedCourseIds).to.have.been.calledOnceWithExactly({
      combinedCourseIds: [1, 2],
    });
    expect(result).to.have.lengthOf(2);
    expect(result[0].participations).to.deep.equal([participation1, participation2]);
    expect(result[1].participations).to.deep.equal([participation3]);
  });

  it('should return empty array when no combined courses exist for organization', async function () {
    // given
    const organizationId = 123;

    const combinedCourseRepositoryStub = {
      findByOrganizationId: sinon.stub().resolves([]),
    };
    const combinedCourseParticipationRepositoryStub = {
      findByCombinedCourseIds: sinon.stub(),
    };

    // when
    const result = await getCombinedCoursesByOrganizationId({
      organizationId,
      combinedCourseRepository: combinedCourseRepositoryStub,
      combinedCourseParticipationRepository: combinedCourseParticipationRepositoryStub,
    });

    // then
    expect(result).to.deep.equal([]);
    expect(combinedCourseParticipationRepositoryStub.findByCombinedCourseIds).to.not.have.been.called;
  });
});
