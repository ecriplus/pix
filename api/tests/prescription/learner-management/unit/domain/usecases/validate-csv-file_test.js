import { IMPORT_STATUSES } from '../../../../../../src/prescription/learner-management/domain/constants.js';
import { AggregateImportError } from '../../../../../../src/prescription/learner-management/domain/errors.js';
import { OrganizationImport } from '../../../../../../src/prescription/learner-management/domain/models/OrganizationImport.js';
import { validateCsvFile } from '../../../../../../src/prescription/learner-management/domain/usecases/validate-csv-file.js';
import { SupOrganizationLearnerImportHeader } from '../../../../../../src/prescription/learner-management/infrastructure/serializers/csv/sup-organization-learner-import-header.js';
import { SupOrganizationLearnerParser } from '../../../../../../src/prescription/learner-management/infrastructure/serializers/csv/sup-organization-learner-parser.js';
import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { catchErr, expect, sinon } from '../../../../../test-helper.js';

const i18n = getI18n();

const supOrganizationLearnerImportHeader = new SupOrganizationLearnerImportHeader(i18n).columns
  .map((column) => column.name)
  .join(';');

describe('Unit | UseCase | validateCsvFile', function () {
  const organizationId = 1234;
  let csvContent, expectedWarnings, organizationImport, organizationImportRepositoryStub, importStorageStub;

  beforeEach(function () {
    csvContent = `${supOrganizationLearnerImportHeader}
    Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123456;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;BAD;BAD;
    `.trim();

    expectedWarnings = [
      {
        studentNumber: '123456',
        field: 'study-scheme',
        value: 'BAD',
        code: 'unknown',
      },
      {
        studentNumber: '123456',
        field: 'diploma',
        value: 'BAD',
        code: 'unknown',
      },
    ];
    organizationImport = new OrganizationImport({
      filename: 'file.csv',
      organizationId,
      createdBy: 2,
      encoding: 'utf-8',
    });

    organizationImportRepositoryStub = {
      getLastByOrganizationId: sinon.stub(),
      save: sinon.stub(),
    };

    importStorageStub = {
      getParser: sinon.stub(),
      deleteFile: sinon.stub(),
    };
  });

  context('when there is no errors', function () {
    it('should save validated state', async function () {
      // given
      organizationImportRepositoryStub.getLastByOrganizationId.withArgs(organizationId).resolves(organizationImport);

      importStorageStub.getParser
        .withArgs({ Parser: SupOrganizationLearnerParser, filename: organizationImport.filename }, organizationId, i18n)
        .resolves(SupOrganizationLearnerParser.buildParser(csvContent, organizationId, i18n));

      // when
      await validateCsvFile({
        Parser: SupOrganizationLearnerParser,
        organizationId,
        i18n,
        organizationImportRepository: organizationImportRepositoryStub,
        importStorage: importStorageStub,
      });

      // then
      expect(organizationImportRepositoryStub.save).to.have.been.calledOnceWithExactly(organizationImport);
      expect(organizationImport.status).to.equal(IMPORT_STATUSES.VALIDATED);
      expect(organizationImport.errors).to.deep.equal(expectedWarnings);
    });
  });

  context('when there is errors', function () {
    let importSupOrganizationLearnersJobRepositoryStub, organizationImportStub;
    beforeEach(function () {
      importSupOrganizationLearnersJobRepositoryStub = {
        performAsync: sinon.stub(),
      };

      organizationImportStub = {
        id: 1,
        filename: Symbol('filename'),
        encoding: Symbol('encoding'),
        validate: sinon.stub(),
        save: sinon.stub(),
      };
      organizationImportRepositoryStub.getLastByOrganizationId
        .withArgs(organizationId)
        .resolves(organizationImportStub);
    });

    context('when there is s3 errors', function () {
      it('should save error when there is an error reading file from S3', async function () {
        const s3Error = new Error('s3 error');
        importStorageStub.getParser.rejects(s3Error);
        const error = await catchErr(validateCsvFile)({
          organizationId,
          organizationImportRepository: organizationImportRepositoryStub,
          importStorage: importStorageStub,
          importSupOrganizationLearnersJobRepository: importSupOrganizationLearnersJobRepositoryStub,
        });
        expect(error).to.eq(s3Error);
        expect(importStorageStub.deleteFile).to.have.been.calledWithExactly({
          filename: organizationImportStub.filename,
        });
        expect(organizationImportRepositoryStub.save).to.have.been.calledWithExactly(organizationImportStub);
        expect(organizationImportStub.validate).to.have.been.calledWithExactly({
          errors: [s3Error],
          warnings: undefined,
        });
      });

      it('should save error when there is an error deleting file from S3', async function () {
        const parserStub = { parse: sinon.stub() };
        importStorageStub.getParser
          .withArgs(
            { Parser: SupOrganizationLearnerParser, filename: organizationImport.filename },
            organizationId,
            i18n,
          )
          .resolves(parserStub);
        parserStub.parse.rejects(new AggregateImportError([new Error('parsing')]));
        const s3Error = new Error('s3 error');
        importStorageStub.deleteFile.rejects(s3Error);

        const error = await catchErr(validateCsvFile)({
          organizationId,
          organizationImportRepository: organizationImportRepositoryStub,
          importStorage: importStorageStub,
          importSupOrganizationLearnersJobRepositoryStub: importSupOrganizationLearnersJobRepositoryStub,
        });
        expect(error).to.eq(s3Error);
        expect(importStorageStub.deleteFile).to.have.been.calledWithExactly({
          filename: organizationImportStub.filename,
        });
        expect(organizationImportRepositoryStub.save).to.have.been.calledWithExactly(organizationImportStub);
      });
    });

    it('should save VALIDATION_ERROR status', async function () {
      // given
      organizationImportRepositoryStub.getLastByOrganizationId.withArgs(organizationId).resolves(organizationImport);
      const csvContent = `${supOrganizationLearnerImportHeader}
          Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123456;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;BAD;BAD;
          Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123456;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;BAD;BAD;
          `.trim();
      importStorageStub.getParser
        .withArgs({ Parser: SupOrganizationLearnerParser, filename: organizationImport.filename }, organizationId, i18n)
        .resolves(SupOrganizationLearnerParser.buildParser(csvContent, organizationId, i18n));

      // when
      await catchErr(validateCsvFile)({
        Parser: SupOrganizationLearnerParser,
        organizationId,
        i18n,
        organizationImportRepository: organizationImportRepositoryStub,
        importStorage: importStorageStub,
      });

      // then
      expect(organizationImportRepositoryStub.save.firstCall.firstArg.status).to.equal('VALIDATION_ERROR');
    });
  });
});
