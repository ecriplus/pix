import sinon from 'sinon';

import { CertificationCourseUpdateError } from '../../../../../../src/certification/shared/domain/errors.js';
import * as certificationReportRepository from '../../../../../../src/certification/shared/infrastructure/repositories/certification-report-repository.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { catchErr, expect } from '../../../../../test-helper.js';

describe('Integration | Repository | CertificationReport', function () {
  describe('#finalizeAll', function () {
    context('when there is an error', function () {
      it('should throw and error and update nothing', async function () {
        // given
        const knexStub = { batchInsert: sinon.stub().throws() };
        sinon.stub(DomainTransaction, 'getConnection').returns(knexStub);

        // when
        const error = await catchErr(certificationReportRepository.finalizeAll)({
          certificationReports: [Symbol('certificationReport')],
        });

        // then
        expect(error).to.be.instanceOf(CertificationCourseUpdateError);
      });
    });
  });
});
