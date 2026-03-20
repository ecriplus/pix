import { FillNewColumnFrameworkInCertificationCourseTable } from '../../../../scripts/certification/fill-new-column-framework-in-certification-course-table.js';
import { Frameworks } from '../../../../src/certification/configuration/domain/models/Frameworks.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Certification | Scripts | Fill new column framework in certification course table', function () {
  let logger, script;

  beforeEach(async function () {
    logger = { info: sinon.stub(), error: sinon.stub() };
    script = new FillNewColumnFrameworkInCertificationCourseTable();
  });

  it('should not commit if dryRun', async function () {
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({
      sessionId,
      userId,
    }).id;
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      framework: null,
    }).id;

    await databaseBuilder.commit();

    const certificationCourseDataBefore = await knex('certification-courses').first();
    expect(certificationCourseDataBefore.candidateId).to.be.null;
    expect(certificationCourseDataBefore.framework).to.be.null;

    await script.handle({
      options: { dryRun: true, throttleDelay: 1, startId: certificationCourseId, chunkSize: 1 },
      logger,
    });

    const certificationCourseDataAfter = await knex('certification-courses').first();
    expect(certificationCourseDataAfter.candidateId).to.be.null;
    expect(certificationCourseDataAfter.framework).to.be.null;
  });

  it("should fill framework with 'CORE' and let candidateId at null for a certification without candidate nor complementary-certification-course", async function () {
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      framework: null,
    }).id;

    await databaseBuilder.commit();

    const certificationCourseDataBefore = await knex('certification-courses').first();
    expect(certificationCourseDataBefore.candidateId).to.be.null;
    expect(certificationCourseDataBefore.framework).to.be.null;

    await script.handle({
      options: { dryRun: false, throttleDelay: 1, startId: certificationCourseId, chunkSize: 1 },
      logger,
    });

    const certificationCourseDataAfter = await knex('certification-courses').first();
    expect(certificationCourseDataAfter.candidateId).to.be.null;
    expect(certificationCourseDataAfter.framework).to.equal(Frameworks.CORE);
  });

  it('should fill framework as CORE and fill candidateId when there are no complementary certification course', async function () {
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    const candidateId = databaseBuilder.factory.buildCertificationCandidate({
      sessionId,
      userId,
    }).id;
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      framework: null,
    }).id;

    await databaseBuilder.commit();

    const certificationCourseDataBefore = await knex('certification-courses').first();
    expect(certificationCourseDataBefore.candidateId).to.be.null;
    expect(certificationCourseDataBefore.framework).to.be.null;

    await script.handle({
      options: { dryRun: false, throttleDelay: 1, startId: certificationCourseId, chunkSize: 1 },
      logger,
    });

    const certificationCourseDataAfter = await knex('certification-courses').first();
    expect(certificationCourseDataAfter.candidateId).to.equal(candidateId);
    expect(certificationCourseDataAfter.framework).to.equal(Frameworks.CORE);
  });

  it('should fill framework as the complementary key and fill candidateId when there is a complementary certification course', async function () {
    const complementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification({
      key: Frameworks.EDU_1ER_DEGRE,
    }).id;
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    const candidateId = databaseBuilder.factory.buildCertificationCandidate({
      sessionId,
      userId,
    }).id;
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      framework: null,
    }).id;
    databaseBuilder.factory.buildComplementaryCertificationCourse({
      certificationCourseId,
      complementaryCertificationId,
      complementaryCertificationBadgeId: null,
    });

    await databaseBuilder.commit();

    const certificationCourseDataBefore = await knex('certification-courses').first();
    expect(certificationCourseDataBefore.candidateId).to.be.null;
    expect(certificationCourseDataBefore.framework).to.be.null;

    await script.handle({
      options: { dryRun: false, throttleDelay: 1, startId: certificationCourseId, chunkSize: 1 },
      logger,
    });

    const certificationCourseDataAfter = await knex('certification-courses').first();
    expect(certificationCourseDataAfter.candidateId).to.equal(candidateId);
    expect(certificationCourseDataAfter.framework).to.equal(Frameworks.EDU_1ER_DEGRE);
  });

  it('should not update certification course when information already filled (especially the framework one, the purpose of the script is not to fix data, just to fill the blanks)', async function () {
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({
      sessionId,
      userId,
    }).id;
    const someOtherCandidateId = databaseBuilder.factory.buildCertificationCandidate().id;
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      userId,
      candidateId: someOtherCandidateId,
      framework: Frameworks.CLEA,
    }).id;

    await databaseBuilder.commit();

    const certificationCourseDataBefore = await knex('certification-courses').first();
    expect(certificationCourseDataBefore.candidateId).to.equal(someOtherCandidateId);
    expect(certificationCourseDataBefore.framework).to.equal(Frameworks.CLEA);

    await script.handle({
      options: { dryRun: false, startId: certificationCourseId, chunkSize: 1 },
      logger,
    });

    const certificationCourseDataAfter = await knex('certification-courses').first();
    expect(certificationCourseDataAfter.candidateId).to.equal(someOtherCandidateId);
    expect(certificationCourseDataAfter.framework).to.equal(Frameworks.CLEA);
    expect(logger.info.getCall(0)).to.have.been.calledWithExactly('Script execution started');
    expect(logger.info.getCall(1)).to.have.been.calledWithExactly('No more certifications to process youpi');
  });

  it('should work when fetching several certification-courses with different contexts', async function () {
    const sessionId1 = databaseBuilder.factory.buildSession().id;
    const userId1 = databaseBuilder.factory.buildUser().id;
    const certificationCourseId1 = databaseBuilder.factory.buildCertificationCourse({
      sessionId: sessionId1,
      userId: userId1,
      framework: null,
    }).id;
    const sessionId2 = databaseBuilder.factory.buildSession().id;
    const userId2 = databaseBuilder.factory.buildUser().id;
    const candidateId2 = databaseBuilder.factory.buildCertificationCandidate({
      sessionId: sessionId2,
      userId: userId2,
    }).id;
    const certificationCourseId2 = databaseBuilder.factory.buildCertificationCourse({
      sessionId: sessionId2,
      userId: userId2,
      framework: null,
    }).id;
    const complementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification({
      key: Frameworks.EDU_1ER_DEGRE,
    }).id;
    const sessionId3 = databaseBuilder.factory.buildSession().id;
    const userId3 = databaseBuilder.factory.buildUser().id;
    const candidateId3 = databaseBuilder.factory.buildCertificationCandidate({
      sessionId: sessionId3,
      userId: userId3,
    }).id;
    const certificationCourseId3 = databaseBuilder.factory.buildCertificationCourse({
      sessionId: sessionId3,
      userId: userId3,
      framework: null,
    }).id;
    databaseBuilder.factory.buildComplementaryCertificationCourse({
      certificationCourseId: certificationCourseId3,
      complementaryCertificationId,
      complementaryCertificationBadgeId: null,
    });
    const sessionId4 = databaseBuilder.factory.buildSession().id;
    const userId4 = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({
      sessionId: sessionId4,
      userId: userId4,
    }).id;
    const someOtherCandidateId = databaseBuilder.factory.buildCertificationCandidate().id;
    const certificationCourseId4 = databaseBuilder.factory.buildCertificationCourse({
      sessionId: sessionId4,
      userId: userId4,
      candidateId: someOtherCandidateId,
      framework: Frameworks.CLEA,
    }).id;

    await databaseBuilder.commit();

    await script.handle({
      options: { dryRun: false, throttleDelay: 1, startId: certificationCourseId1, chunkSize: 1 },
      logger,
    });

    const certificationCourseDatas = await knex('certification-courses')
      .select(['id', 'candidateId', 'framework'])
      .orderBy('id');
    expect(certificationCourseDatas.length).to.equal(4);
    expect(certificationCourseDatas[0]).to.deep.equal({
      id: certificationCourseId1,
      candidateId: null,
      framework: Frameworks.CORE,
    });
    expect(certificationCourseDatas[1]).to.deep.equal({
      id: certificationCourseId2,
      candidateId: candidateId2,
      framework: Frameworks.CORE,
    });
    expect(certificationCourseDatas[2]).to.deep.equal({
      id: certificationCourseId3,
      candidateId: candidateId3,
      framework: Frameworks.EDU_1ER_DEGRE,
    });
    expect(certificationCourseDatas[3]).to.deep.equal({
      id: certificationCourseId4,
      candidateId: someOtherCandidateId,
      framework: Frameworks.CLEA,
    });
  });

  it('should provide appropriate logger informations', async function () {
    const sessionId = databaseBuilder.factory.buildSession().id;
    const userId = databaseBuilder.factory.buildUser().id;
    const certificationCourseIds = [];
    for (let i = 0; i < 4; i++) {
      const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
        sessionId,
        userId,
        framework: null,
      }).id;
      certificationCourseIds.push(certificationCourseId);
    }
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
});
