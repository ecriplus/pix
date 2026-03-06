import { FillNewColumnsInCertificationCoursesAndCandidatesTables } from '../../../../scripts/certification/fill-new-columns-in-certification-courses-and-candidates-tables.js';
import { Frameworks } from '../../../../src/certification/configuration/domain/models/Frameworks.js';
import { AlgorithmEngineVersion } from '../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { SCOPES } from '../../../../src/certification/shared/domain/models/Scopes.js';
import { catchErr, databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Certification | Scripts | Fill new columns in certification courses and candidate tables', function () {
  let logger, script;

  beforeEach(async function () {
    logger = { info: sinon.stub(), error: sinon.stub() };
    script = new FillNewColumnsInCertificationCoursesAndCandidatesTables();
  });

  it('should not commit if dryRun', async function () {
    const startDate = new Date('2025-10-01');
    const reconciledAt = new Date('2026-01-01');

    const expirationDate = null;

    databaseBuilder.factory.buildCertificationVersion({
      startDate,
      expirationDate,
    }).id;

    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({
      sessionId,
      reconciledAt: reconciledAt,
      userId,
    }).id;
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      version: AlgorithmEngineVersion.V3,
    }).id;

    await databaseBuilder.commit();

    const certificationCourseDataBefore = await knex('certification-courses').first();
    expect(certificationCourseDataBefore.versionId).to.be.null;
    expect(certificationCourseDataBefore.candidateId).to.be.null;
    const certificationCandidateDataBefore = await knex('certification-candidates').first();
    expect(certificationCandidateDataBefore.subscription).to.be.null;

    await script.handle({ options: { dryRun: true, startId: certificationCourseId, chunkSize: 1 }, logger });

    const certificationCourseDataAfter = await knex('certification-courses').first();
    const certificationCandidateDataAfter = await knex('certification-candidates').first();
    expect(certificationCourseDataAfter.versionId).to.be.null;
    expect(certificationCourseDataAfter.candidateId).to.be.null;
    expect(certificationCandidateDataAfter.subscription).to.be.null;
  });

  it('should fill candidateId and versionid in certification courses and subscription in certification candidate', async function () {
    const startDateArchivedVersion = new Date('2025-01-01');
    const expirationDateArchivedVersion = new Date('2026-01-01');
    const startDateCurrentVersion = expirationDateArchivedVersion;
    const expirationDateCurrentVersion = null;
    const reconciledAtArchivedVersion = new Date('2025-07-01');
    const reconciledAtCurrentVersion = new Date('2026-02-01');
    const candidateIds = [];

    const droitComplementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification.droit().id;
    const cleaComplementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification.clea().id;

    const coreVersionArchivedId = databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateArchivedVersion,
      expirationDate: expirationDateArchivedVersion,
      scope: SCOPES.CORE,
    }).id;

    const droitVersionArchivedId = databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateArchivedVersion,
      expirationDate: expirationDateArchivedVersion,
      scope: SCOPES.PIX_PLUS_DROIT,
    }).id;

    const coreVersionCurrentId = databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateCurrentVersion,
      expirationDate: expirationDateCurrentVersion,
      scope: SCOPES.CORE,
    }).id;

    const droitVersionCurrentId = databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateCurrentVersion,
      expirationDate: expirationDateCurrentVersion,
      scope: SCOPES.PIX_PLUS_DROIT,
    }).id;

    _createCertificationCourses({
      reconciledAt: reconciledAtArchivedVersion,
      subscriptionIds: [null, droitComplementaryCertificationId, cleaComplementaryCertificationId],
      candidateIds,
    });
    _createCertificationCourses({
      reconciledAt: reconciledAtCurrentVersion,
      subscriptionIds: [null, droitComplementaryCertificationId, cleaComplementaryCertificationId],
      candidateIds,
    });

    await databaseBuilder.commit();

    const certificationCourseDataBefore = await knex('certification-courses').orderBy('id');
    expect(certificationCourseDataBefore.length).to.equal(6);
    const certificationCandidateDataBefore = await knex('certification-candidates').orderBy('id');
    expect(certificationCandidateDataBefore.length).to.equal(6);
    for (let i = 0; i < 6; i++) {
      expect(certificationCourseDataBefore[i].versionId).to.be.null;
      expect(certificationCourseDataBefore[i].candidateId).to.be.null;
      expect(certificationCandidateDataBefore[i].subscription).to.be.null;
    }

    const expectedVersionIds = [
      coreVersionArchivedId,
      droitVersionArchivedId,
      coreVersionArchivedId,
      coreVersionCurrentId,
      droitVersionCurrentId,
      coreVersionCurrentId,
    ];
    const expectedSubscriptions = [
      Frameworks.CORE,
      Frameworks.DROIT,
      Frameworks.CLEA,
      Frameworks.CORE,
      Frameworks.DROIT,
      Frameworks.CLEA,
    ];

    await script.handle({
      options: { dryRun: false, startId: certificationCourseDataBefore[0].id, chunkSize: 2 },
      logger,
    });

    const certificationCourseDataAfter = await knex('certification-courses').orderBy('id');
    const certificationCandidateDataAfter = await knex('certification-candidates').orderBy('id');

    expect(certificationCourseDataAfter.length).to.equal(6);
    expect(certificationCandidateDataAfter.length).to.equal(6);

    for (let i = 0; i < 6; i++) {
      expect(certificationCourseDataAfter[i].versionId).to.equal(expectedVersionIds[i]);
      expect(certificationCourseDataAfter[i].candidateId).to.equal(candidateIds[i]);
      expect(certificationCandidateDataAfter[i].subscription).to.equal(expectedSubscriptions[i]);
    }
  });

  it('should provide appropriate logger informations', async function () {
    const startDateCurrentVersion = new Date('2026-01-01');
    const expirationDateCurrentVersion = null;
    const reconciledAt = new Date('2026-02-01');
    const certificationCourseIds = [];

    databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateCurrentVersion,
      expirationDate: expirationDateCurrentVersion,
      scope: SCOPES.CORE,
    }).id;

    _createCertificationCourses({
      reconciledAt,
      subscriptionIds: [null, null, null, null],
      certificationCourseIds,
    });
    await databaseBuilder.commit();

    await script.handle({ options: { dryRun: false, startId: certificationCourseIds[0], chunkSize: 2 }, logger });

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
    expect(logger.info.getCall(5)).to.have.been.calledWithExactly('No more certifications to process youpi');
  });

  it('should throw an error when no matching version to reconciledAt date is found, and rollback chunk', async function () {
    const startDateArchivedVersion = new Date('2025-01-01');
    const expirationDateArchivedVersion = new Date('2026-01-01');
    const reconciledAtArchivedVersion = new Date('2025-07-01');
    const reconciledAtNonExistingVersion = new Date('2026-02-01');
    const certificationCourseIds = [];

    const coreVersionArchivedId = databaseBuilder.factory.buildCertificationVersion({
      startDate: startDateArchivedVersion,
      expirationDate: expirationDateArchivedVersion,
      scope: SCOPES.CORE,
    }).id;

    _createCertificationCourses({
      reconciledAt: reconciledAtArchivedVersion,
      subscriptionIds: [null, null, null],
      certificationCourseIds,
    });
    _createCertificationCourses({
      reconciledAt: reconciledAtNonExistingVersion,
      subscriptionIds: [null],
      certificationCourseIds,
    });

    await databaseBuilder.commit();

    const err = await catchErr(script.handle)({
      options: { dryRun: false, startId: certificationCourseIds[0], chunkSize: 2 },
      logger,
    });

    const certificationCourseDataAfter = await knex('certification-courses').orderBy('id');
    const certificationCandidateDataAfter = await knex('certification-candidates').orderBy('id');
    expect(certificationCourseDataAfter.length).to.equal(4);
    expect(certificationCandidateDataAfter.length).to.equal(4);

    expect(certificationCourseDataAfter[0].versionId).to.equal(coreVersionArchivedId);
    expect(certificationCandidateDataAfter[0].subscription).to.equal(Frameworks.CORE);
    expect(certificationCourseDataAfter[2].versionId).to.be.null;
    expect(certificationCandidateDataAfter[2].subscription).to.be.null;

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
    expect(err).to.have.property(
      'message',
      `No Certification Scoring found for ${reconciledAtNonExistingVersion} date.`,
    );
    expect(logger.error).to.have.been.calledWithExactly(
      err,
      `Certification ID ${certificationCourseIds[3]} encountered an error`,
    );
  });
});

function _createCertificationCourses({
  reconciledAt,
  subscriptionIds,
  candidateIds = [],
  certificationCourseIds = [],
}) {
  const sessionId = databaseBuilder.factory.buildSession().id;

  for (const subscriptionId of subscriptionIds) {
    const userId = databaseBuilder.factory.buildUser().id;
    const candidateId = databaseBuilder.factory.buildCertificationCandidate({
      sessionId,
      reconciledAt,
      userId,
    }).id;

    const certificationCoursesId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      version: AlgorithmEngineVersion.V3,
    }).id;

    if (subscriptionId) {
      databaseBuilder.factory.buildComplementaryCertificationSubscription({
        certificationCandidateId: candidateId,
        complementaryCertificationId: subscriptionId,
      });
    }

    candidateIds.push(candidateId);
    certificationCourseIds.push(certificationCoursesId);
  }
}
