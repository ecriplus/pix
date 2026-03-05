import { FillCapacityMeshindexVersionidColumnsInAssessmentResultsTable } from '../../../../scripts/certification/fill-capacity-meshindex-versionid-columns-in-assessment-results-table.js';
import { AlgorithmEngineVersion } from '../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { catchErr, databaseBuilder, expect, knex, mockLearningContent, sinon } from '../../../test-helper.js';

describe('Integration | Certification | Scripts | Fill capacity, meshindex, versionid columns in assessment results', function () {
  let logger, script;

  const learningContent = {
    areas: [{ id: 'recArea1', competenceIds: ['recCompetence1'] }],
    competences: [
      {
        id: 'recCompetence1',
        index: '1.1',
        areaId: 'recArea1',
        origin: 'Pix',
        name_i18n: {
          fr: 'Nom de la competence FR',
          en: 'Nom de la competence EN',
        },
      },
    ],
  };

  beforeEach(async function () {
    logger = { info: sinon.stub(), error: sinon.stub() };
    script = new FillCapacityMeshindexVersionidColumnsInAssessmentResultsTable();
    await mockLearningContent(learningContent);
  });

  it('should not commit if dryRun', async function () {
    const startDate = new Date('2025-10-01');
    const expirationDate = null;

    databaseBuilder.factory.buildCertificationVersion({
      startDate,
      expirationDate,
    }).id;

    const pixScores = [0, 895];

    const certificationCourseIds = [];
    _createBatchAssessmentResults({
      reconciledAt: new Date('2025-12-23'),
      pixScores,
      certificationCourseIds,
    });

    await databaseBuilder.commit();

    const assessmentResultDataBefore = await knex('assessment-results').orderBy('id');

    await script.handle({ options: { dryRun: true, startId: certificationCourseIds[0], chunkSize: 1 }, logger });

    const assessmentResultData = await knex('assessment-results').orderBy('id');
    expect(assessmentResultData).to.deep.equal(assessmentResultDataBefore);
  });

  it('should fill capacity, meshindex and versionid in assessment results for current version', async function () {
    const startDate = new Date('2025-10-01');
    const expirationDate = null;

    const versionId = databaseBuilder.factory.buildCertificationVersion({
      startDate,
      expirationDate,
    }).id;

    const pixScores = [0, 895];

    const certificationCourseIds = [];
    _createBatchAssessmentResults({
      reconciledAt: new Date('2025-12-23'),
      pixScores,
      certificationCourseIds,
    });

    await databaseBuilder.commit();

    const assessmentResultDataBefore = await knex('assessment-results').orderBy('id');
    expect(assessmentResultDataBefore).to.have.lengthOf(pixScores.length);
    expect(assessmentResultDataBefore[0].capacity).to.be.null;
    expect(assessmentResultDataBefore[0].reachedMeshIndex).to.be.null;
    expect(assessmentResultDataBefore[0].versionId).to.be.null;
    expect(assessmentResultDataBefore[1].capacity).to.be.null;
    expect(assessmentResultDataBefore[1].reachedMeshIndex).to.be.null;
    expect(assessmentResultDataBefore[1].versionId).to.be.null;

    await script.handle({ options: { dryRun: false, startId: certificationCourseIds[0], chunkSize: 1 }, logger });

    const assessmentResultData = await knex('assessment-results').orderBy('id');
    expect(assessmentResultData).to.have.lengthOf(pixScores.length);
    expect(Math.ceil(assessmentResultData[0].capacity)).to.equal(-8);
    expect(assessmentResultData[0].reachedMeshIndex).to.equal(0);
    expect(assessmentResultData[0].versionId).to.equal(versionId);
    expect(Math.ceil(assessmentResultData[1].capacity)).to.equal(8);
    expect(assessmentResultData[1].reachedMeshIndex).to.equal(7);
    expect(assessmentResultData[1].versionId).to.equal(versionId);
  });

  it('should fill capacity, meshindex and versionid in assessment results for expired version', async function () {
    const startDate = new Date('2025-10-01');
    const expirationDate = new Date('2026-01-01');

    const versionId = databaseBuilder.factory.buildCertificationVersion({
      startDate,
      expirationDate,
    }).id;

    const pixScores = [0, 895];

    const certificationCourseIds = [];
    _createBatchAssessmentResults({
      reconciledAt: new Date('2025-12-23'),
      pixScores,
      certificationCourseIds,
    });

    await databaseBuilder.commit();

    const assessmentResultDataBefore = await knex('assessment-results').orderBy('id');
    expect(assessmentResultDataBefore).to.have.lengthOf(pixScores.length);
    expect(assessmentResultDataBefore[0].capacity).to.be.null;
    expect(assessmentResultDataBefore[0].reachedMeshIndex).to.be.null;
    expect(assessmentResultDataBefore[0].versionId).to.be.null;
    expect(assessmentResultDataBefore[1].capacity).to.be.null;
    expect(assessmentResultDataBefore[1].reachedMeshIndex).to.be.null;
    expect(assessmentResultDataBefore[1].versionId).to.be.null;

    await script.handle({ options: { dryRun: false, startId: certificationCourseIds[0], chunkSize: 1 }, logger });

    const assessmentResultData = await knex('assessment-results').orderBy('id');
    expect(assessmentResultData).to.have.lengthOf(pixScores.length);
    expect(Math.ceil(assessmentResultData[0].capacity)).to.equal(-8);
    expect(assessmentResultData[0].reachedMeshIndex).to.equal(0);
    expect(assessmentResultData[0].versionId).to.equal(versionId);
    expect(Math.ceil(assessmentResultData[1].capacity)).to.equal(8);
    expect(assessmentResultData[1].reachedMeshIndex).to.equal(7);
    expect(assessmentResultData[1].versionId).to.equal(versionId);
  });

  it('should correctly process certification from two different versions with appropriate logger informations', async function () {
    const startDateArchivedVersion = new Date('2025-01-01');
    const expirationDateArchivedVersion = new Date('2026-01-01');
    const startDateCurrentVersion = expirationDateArchivedVersion;
    const expirationDateCurrentVersion = null;
    const pixScores = [0, 450, 895];
    const certificationCourseIds = [];

    const versionIdArchivedVersion = databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateArchivedVersion,
      expirationDate: expirationDateArchivedVersion,
    }).id;

    _createBatchAssessmentResults({
      reconciledAt: new Date('2025-12-23'),
      pixScores,
      certificationCourseIds,
    });

    const versionIdCurrentVersion = databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateCurrentVersion,
      expirationDate: expirationDateCurrentVersion,
    }).id;

    _createBatchAssessmentResults({
      reconciledAt: new Date('2026-01-10'),
      pixScores,
      certificationCourseIds,
    });

    await databaseBuilder.commit();

    await script.handle({ options: { dryRun: false, startId: certificationCourseIds[0], chunkSize: 2 }, logger });

    const assessmentResultData = await knex('assessment-results').orderBy('id');
    expect(assessmentResultData).to.have.lengthOf(6);
    expect(assessmentResultData[0].versionId).to.equal(versionIdArchivedVersion);
    expect(assessmentResultData[3].versionId).to.equal(versionIdCurrentVersion);
    expect(logger.info.getCall(0)).to.have.been.calledWithExactly('Script execution started');
    expect(logger.info.getCall(1)).to.have.been.calledWithExactly(
      `Processing certification from ${certificationCourseIds[0]} to ${certificationCourseIds[1]}...`,
    );
    expect(logger.info.getCall(2)).to.have.been.calledWithExactly(
      `Certifications up until ID ${certificationCourseIds[1]} DONE`,
    );
    expect(logger.info.getCall(3)).to.have.been.calledWithExactly(
      `Processing certification from ${certificationCourseIds[2]} to ${certificationCourseIds[3]}...`,
    );
    expect(logger.info.getCall(4)).to.have.been.calledWithExactly(
      `Certifications up until ID ${certificationCourseIds[3]} DONE`,
    );
    expect(logger.info.getCall(5)).to.have.been.calledWithExactly(
      `Processing certification from ${certificationCourseIds[4]} to ${certificationCourseIds[5]}...`,
    );
    expect(logger.info.getCall(6)).to.have.been.calledWithExactly(
      `Certifications up until ID ${certificationCourseIds[5]} DONE`,
    );
    expect(logger.info.getCall(7)).to.have.been.calledWithExactly('No more certifications to process youpi');
  });

  it('should throw an error when no matching version to reconciledAt date is found, and rollback chunk', async function () {
    const startDate = new Date('2025-10-01');
    const expirationDate = new Date('2026-01-01');
    const certificationCourseIds = [];

    const versionId = databaseBuilder.factory.buildCertificationVersion({
      startDate,
      expirationDate,
    }).id;

    const pixScores = [0, 450, 895];

    _createBatchAssessmentResults({
      reconciledAt: new Date('2025-12-23'),
      pixScores,
      certificationCourseIds,
    });

    const reconciledAt = new Date();
    _createBatchAssessmentResults({
      reconciledAt,
      pixScores: [500],
      certificationCourseIds,
    });

    await databaseBuilder.commit();

    const err = await catchErr(script.handle)({
      options: { dryRun: false, startId: certificationCourseIds[0], chunkSize: 2 },
      logger,
    });

    const assessmentResultData = await knex('assessment-results').orderBy('id');
    expect(assessmentResultData).to.have.lengthOf(4);
    expect(assessmentResultData[0].versionId).to.equal(versionId);
    expect(assessmentResultData[2].versionId).to.equal(null);
    expect(logger.info.getCall(0)).to.have.been.calledWithExactly('Script execution started');
    expect(logger.info.getCall(1)).to.have.been.calledWithExactly(
      `Processing certification from ${certificationCourseIds[0]} to ${certificationCourseIds[1]}...`,
    );
    expect(logger.info.getCall(2)).to.have.been.calledWithExactly(
      `Certifications up until ID ${certificationCourseIds[1]} DONE`,
    );
    expect(logger.info.getCall(3)).to.have.been.calledWithExactly(
      `Processing certification from ${certificationCourseIds[2]} to ${certificationCourseIds[3]}...`,
    );
    expect(err).to.be.instanceOf(Error);
    expect(err).to.have.property('message', `No Certification Scoring found for ${reconciledAt} date.`);
    expect(logger.error).to.have.been.calledWithExactly(
      err,
      `Certification ID ${certificationCourseIds[3]} encountered an error`,
    );
  });
});

function _createBatchAssessmentResults({ reconciledAt, pixScores, certificationCourseIds }) {
  for (const pixScore of pixScores) {
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({ sessionId, reconciledAt: reconciledAt, userId });
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      version: AlgorithmEngineVersion.V3,
    }).id;
    certificationCourseIds.push(certificationCourseId);
    const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId }).id;
    const lastAssessmentResultId = databaseBuilder.factory.buildAssessmentResult({ assessmentId, pixScore }).id;
    databaseBuilder.factory.buildCertificationCourseLastAssessmentResult({
      certificationCourseId,
      lastAssessmentResultId,
    });
  }
}
