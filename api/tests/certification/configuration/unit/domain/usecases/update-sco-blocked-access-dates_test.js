import { updateScoBlockedAccessDate } from '../../../../../../src/certification/configuration/domain/usecases/update-sco-blocked-access-date.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | update-sco-blocked-access-date', function () {
  let scoBlockedAccessDatesRepositoryStub;

  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });

    scoBlockedAccessDatesRepositoryStub = {
      updateScoBlockedAccessDate: sinon.stub().resolves(),
    };
  });

  it('should update a sco blocked access date', async function () {
    // given
    const scoOrganizationType = 'lycee';
    const reopeningDate = new Date('2025-12-15');

    // when
    await updateScoBlockedAccessDate({
      scoOrganizationType,
      reopeningDate,
      scoBlockedAccessDatesRepository: scoBlockedAccessDatesRepositoryStub,
    });

    // then
    expect(scoBlockedAccessDatesRepositoryStub.updateScoBlockedAccessDate).to.have.been.calledOnceWithExactly({
      scoOrganizationType,
      reopeningDate,
    });
  });
});
