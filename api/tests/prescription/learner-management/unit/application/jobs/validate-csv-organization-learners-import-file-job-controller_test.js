import { ValidateCsvOrganizationLearnersImportFileJobController } from '../../../../../../src/prescription/learner-management/application/jobs/validate-csv-organization-learners-import-file-job-controller.js';
import { usecases } from '../../../../../../src/prescription/learner-management/domain/usecases/index.js';
import { SupOrganizationLearnerParser } from '../../../../../../src/prescription/learner-management/infrastructure/serializers/csv/sup-organization-learner-parser.js';
import { S3FileDoesNotExistError } from '../../../../../../src/prescription/learner-management/infrastructure/storage/import-storage.js';
import { config } from '../../../../../../src/shared/config.js';
import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { catchErr, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Prescription | Application | Jobs | validateCsvOrganizationLearnersImportFileJobController', function () {
  describe('#isJobEnabled', function () {
    it('return true when job is enabled', function () {
      //given
      sinon.stub(config.pgBoss, 'validationFileJobEnabled').value(true);

      // when
      const handler = new ValidateCsvOrganizationLearnersImportFileJobController();

      // then
      expect(handler.isJobEnabled).to.be.true;
    });

    it('return false when job is disabled', function () {
      //given
      sinon.stub(config.pgBoss, 'validationFileJobEnabled').value(false);

      //when
      const handler = new ValidateCsvOrganizationLearnersImportFileJobController();

      //then
      expect(handler.isJobEnabled).to.be.false;
    });
  });

  describe('#handle', function () {
    it('should call usecase', async function () {
      sinon.stub(usecases, 'validateCsvFile');
      // given
      const handler = new ValidateCsvOrganizationLearnersImportFileJobController();
      const data = { organizationImportId: Symbol('organizationImportId'), locale: 'en', type: 'ADDITIONAL_STUDENT' };

      // when
      await handler.handle({ data });

      // then
      expect(usecases.validateCsvFile).to.have.been.calledOnce;
      expect(usecases.validateCsvFile).to.have.been.calledWithExactly({
        organizationImportId: data.organizationImportId,
        i18n: getI18n(data.locale),
        type: data.type,
        Parser: SupOrganizationLearnerParser,
      });
    });

    it('should not throw when error is from domain', async function () {
      const error = new S3FileDoesNotExistError();
      sinon.stub(usecases, 'validateCsvFile').rejects(error);

      // given
      const warnStub = sinon.stub();
      const handler = new ValidateCsvOrganizationLearnersImportFileJobController({ logger: { warn: warnStub } });
      const data = { organizationImportId: Symbol('organizationImportId') };

      // when
      await handler.handle({ data });

      // then
      expect(warnStub).to.have.been.calledWithExactly(error);
    });

    it('should throw when error is not from domain', async function () {
      const error = new Error();
      sinon.stub(usecases, 'validateCsvFile').rejects(error);

      // given
      const handler = new ValidateCsvOrganizationLearnersImportFileJobController();
      const data = { organizationImportId: Symbol('organizationImportId') };

      // when
      const result = await catchErr(handler.handle)({ data });

      // then
      expect(result).to.equal(error);
    });
  });
});
