import { getScoBlockedAccessDates } from '../../../../../../src/certification/configuration/domain/usecases/get-sco-blocked-access-dates.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | get-sco-blocked-access-dates', function () {
  let scoBlockedAccessDatesRepository;

  beforeEach(function () {
    scoBlockedAccessDatesRepository = {
      getScoBlockedAccessDates: sinon.stub(),
    };
  });

  it('should return sco blocked access dates', async function () {
    // given
    const scoBlockedAccessDates = domainBuilder.certification.configuration.buildScoBlockedAccessDates();
    scoBlockedAccessDatesRepository.getScoBlockedAccessDates.resolves(scoBlockedAccessDates);

    // when
    const results = await getScoBlockedAccessDates({ scoBlockedAccessDatesRepository });

    // then
    expect(scoBlockedAccessDatesRepository.getScoBlockedAccessDates).to.have.been.calledOnce;
    expect(results).to.deep.equal(scoBlockedAccessDates);
  });
});
