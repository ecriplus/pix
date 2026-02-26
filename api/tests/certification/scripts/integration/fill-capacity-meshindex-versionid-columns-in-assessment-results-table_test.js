import { FillCapacityMeshindexVersionidColumnsInAssessmentResultsTable } from '../../../../scripts/certification/fill-capacity-meshindex-versionid-columns-in-assessment-results-table.js';
import { AlgorithmEngineVersion } from '../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { databaseBuilder, expect, knex, mockLearningContent, sinon } from '../../../test-helper.js';

describe.only('Integration | Certification | Scripts | Fill capacity, meshindex, versionid columns in assessment results', function () {
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

  it('should fill capacity, meshindex and versionid in assessment results', async function () {
    const startDate = new Date('2025-10-01');
    const expirationDate = null;

    const versionId = databaseBuilder.factory.buildCertificationVersion({
      startDate,
      expirationDate,
    }).id;

    const pixScores = [0, 895];

    const firstCertificationCourseId = _createBatchAssessmentResults({
      reconciledAt: new Date('2025-12-23'),
      pixScores,
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

    await script.handle({ options: { dryRun: false, startId: firstCertificationCourseId, chunkSize: 1 }, logger });

    const assessmentResultData = await knex('assessment-results').orderBy('id');
    expect(assessmentResultData).to.have.lengthOf(pixScores.length);
    expect(Math.ceil(assessmentResultData[0].capacity)).to.equal(-8);
    expect(assessmentResultData[0].reachedMeshIndex).to.equal(0);
    expect(assessmentResultData[0].versionId).to.equal(versionId);
    expect(Math.ceil(assessmentResultData[1].capacity)).to.equal(8);
    expect(assessmentResultData[1].reachedMeshIndex).to.equal(7);
    expect(assessmentResultData[1].versionId).to.equal(versionId);
  });
});

function _createBatchAssessmentResults({ reconciledAt, pixScores }) {
  let firstCertificationCourseId;
  for (const pixScore of pixScores) {
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({ sessionId, reconciledAt: reconciledAt, userId });
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      version: AlgorithmEngineVersion.V3,
    }).id;
    firstCertificationCourseId = firstCertificationCourseId || certificationCourseId;
    const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId }).id;
    const lastAssessmentResultId = databaseBuilder.factory.buildAssessmentResult({ assessmentId, pixScore }).id;
    databaseBuilder.factory.buildCertificationCourseLastAssessmentResult({
      certificationCourseId,
      lastAssessmentResultId,
    });
  }
  return firstCertificationCourseId;
}
