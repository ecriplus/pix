import { ImportSupOrganizationLearnersJobController } from '../../../../../../src/prescription/learner-management/application/jobs/import-sup-organization-learners-job-controller.js';
import { usecases } from '../../../../../../src/prescription/learner-management/domain/usecases/index.js';
import { config } from '../../../../../../src/shared/config.js';
import { OrganizationLearnersCouldNotBeSavedError } from '../../../../../../src/shared/domain/errors.js';
import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { catchErr, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Prescription | Application | Jobs | importSupOrganizationLearnersJobController', function () {
  describe('#isJobEnabled', function () {
    it('return true when job is enabled', function () {
      //given
      sinon.stub(config.pgBoss, 'importFileJobEnabled').value(true);

      // when
      const handler = new ImportSupOrganizationLearnersJobController();

      // then
      expect(handler.isJobEnabled).to.be.true;
    });

    it('return false when job is disabled', function () {
      //given
      sinon.stub(config.pgBoss, 'importFileJobEnabled').value(false);

      //when
      const handler = new ImportSupOrganizationLearnersJobController();

      //then
      expect(handler.isJobEnabled).to.be.false;
    });
  });

  describe('#handle', function () {
    describe('#importSupOrganizationLearners', function () {
      it('should call usecase', async function () {
        sinon.stub(usecases, 'importSupOrganizationLearners');

        // given
        const handler = new ImportSupOrganizationLearnersJobController();
        const data = { organizationImportId: Symbol('organizationImportId'), locale: 'en', type: 'ADDITIONAL_STUDENT' };

        // when
        await handler.handle({ data });

        // then
        expect(usecases.importSupOrganizationLearners).to.have.been.calledOnce;
        expect(usecases.importSupOrganizationLearners).to.have.been.calledWithExactly({
          organizationImportId: data.organizationImportId,
          i18n: getI18n(data.locale),
        });
      });

      it('should not throw when error is from domain', async function () {
        const error = new OrganizationLearnersCouldNotBeSavedError();
        sinon.stub(usecases, 'importSupOrganizationLearners').rejects(error);

        // given
        const errorStub = sinon.stub();
        const handler = new ImportSupOrganizationLearnersJobController({ logger: { error: errorStub } });
        const data = { organizationImportId: Symbol('organizationImportId'), locale: 'en', type: 'ADDITIONAL_STUDENT' };

        // when & then
        await handler.handle({ data });

        expect(errorStub).to.have.been.calledWithExactly(error);
      });

      it('should throw when error is not from domain', async function () {
        const error = new Error();
        sinon.stub(usecases, 'importSupOrganizationLearners').rejects(error);

        // given
        const handler = new ImportSupOrganizationLearnersJobController();
        const data = { organizationImportId: Symbol('organizationImportId'), locale: 'en', type: 'ADDITIONAL_STUDENT' };

        // when
        const result = await catchErr(handler.handle)({ data });

        // then
        expect(result).to.equal(error);
      });
    });

    describe('#replaceSupOrganizationLearners', function () {
      it('should call usecase', async function () {
        sinon.stub(usecases, 'replaceSupOrganizationLearners');

        // given
        const handler = new ImportSupOrganizationLearnersJobController();
        const data = { organizationImportId: Symbol('organizationImportId'), locale: 'en', type: 'REPLACE_STUDENT' };

        // when
        await handler.handle({ data });

        // then
        expect(usecases.replaceSupOrganizationLearners).to.have.been.calledOnce;
        expect(usecases.replaceSupOrganizationLearners).to.have.been.calledWithExactly({
          organizationImportId: data.organizationImportId,
          i18n: getI18n(data.locale),
        });
      });

      it('should not throw when error is from domain', async function () {
        const error = new OrganizationLearnersCouldNotBeSavedError();
        sinon.stub(usecases, 'replaceSupOrganizationLearners').rejects(error);

        // given
        const errorStub = sinon.stub();
        const handler = new ImportSupOrganizationLearnersJobController({ logger: { error: errorStub } });
        const data = { organizationImportId: Symbol('organizationImportId'), locale: 'en', type: 'REPLACE_STUDENT' };

        // when & then
        await handler.handle({ data });

        expect(errorStub).to.have.been.calledWithExactly(error);
      });

      it('should throw when error is not from domain', async function () {
        const error = new Error();
        sinon.stub(usecases, 'replaceSupOrganizationLearners').rejects(error);

        // given
        const handler = new ImportSupOrganizationLearnersJobController();
        const data = { organizationImportId: Symbol('organizationImportId'), locale: 'en', type: 'REPLACE_STUDENT' };

        // when
        const result = await catchErr(handler.handle)({ data });

        // then
        expect(result).to.equal(error);
      });
    });
  });
});
