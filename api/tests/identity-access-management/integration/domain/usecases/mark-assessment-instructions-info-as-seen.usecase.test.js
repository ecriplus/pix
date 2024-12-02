import { usecases } from '../../../../../src/identity-access-management/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Identity Access Management | Domain | UseCase | markAssessmentInstructionsInfoAsSeen', function () {
  it('should update hasSeenAssessmentInstructions property as true for the user', async function () {
    // given
    const user = databaseBuilder.factory.buildUser({
      email: 'myusertoupdate@example.net',
      hasSeenAssessmentInstructions: false,
    });
    await databaseBuilder.commit();

    // when
    const result = await usecases.markAssessmentInstructionsInfoAsSeen({
      userId: user.id,
    });

    // then
    expect(result.hasSeenAssessmentInstructions).to.be.true;
  });
});
