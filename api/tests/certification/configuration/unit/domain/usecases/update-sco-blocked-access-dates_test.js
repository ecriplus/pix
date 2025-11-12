import { updateScoBlockedAccessDates } from '../../../../../../src/certification/configuration/domain/usecases/update-sco-blocked-access-dates.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | update-sco-blocked-access-dates', function () {
  let scoBlockedAccessDatesRepositoryStub;

  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });

    // Crée le stub du repository
    scoBlockedAccessDatesRepositoryStub = {
      updateScoBlockedAccessDate: sinon.stub().resolves(), // void, pas de retour
    };
  });

  it('should update a sco blocked access date', async function () {
    // given
    const key = 'lycee';
    const value = new Date('2025-12-15');

    // when
    await updateScoBlockedAccessDates({
      key,
      value,
      scoBlockedAccessDates: scoBlockedAccessDatesRepositoryStub,
    });

    // then
    expect(scoBlockedAccessDatesRepositoryStub.updateScoBlockedAccessDate).to.have.been.calledOnceWithExactly({
      key,
      value,
    });
  });
});
