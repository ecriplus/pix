import { FillNewColumnsInCertificationCandidatesTable } from '../../../../scripts/certification/fill-new-columns-in-certification-candidates-table.js';
import { Frameworks } from '../../../../src/certification/configuration/domain/models/Frameworks.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Certification | Scripts | Fill new columns in certification candidate tables', function () {
  let logger, script;

  beforeEach(function () {
    logger = { info: sinon.stub(), error: sinon.stub() };
    script = new FillNewColumnsInCertificationCandidatesTable();
  });

  it('should not commit if dryRun', async function () {
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({
      userId,
    });

    await databaseBuilder.commit();

    const certificationCandidateDataBefore = await knex('certification-candidates').first();
    expect(certificationCandidateDataBefore.subscription).to.be.null;

    await script.handle({ options: { dryRun: true, startId: 0, chunkSize: 1 }, logger });

    const certificationCandidateDataAfter = await knex('certification-candidates').first();
    expect(certificationCandidateDataAfter.subscription).to.be.null;
  });

  it('should fill subscription in certification candidate', async function () {
    const reconciledAtArchivedVersion = new Date('2025-07-01');
    const reconciledAtCurrentVersion = new Date('2026-02-01');
    const candidateIds = [];

    const droitComplementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification.droit().id;
    const cleaComplementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification.clea().id;

    _createCertificationCandidates({
      reconciledAt: reconciledAtArchivedVersion,
      subscriptions: [
        { frameworkType: Frameworks.CORE, id: null },
        { frameworkType: Frameworks.DROIT, id: droitComplementaryCertificationId },
        { frameworkType: Frameworks.CLEA, id: cleaComplementaryCertificationId },
      ],
      candidateIds,
    });
    _createCertificationCandidates({
      reconciledAt: reconciledAtCurrentVersion,
      subscriptions: [
        { frameworkType: Frameworks.CORE, id: null },
        { frameworkType: Frameworks.DROIT, id: droitComplementaryCertificationId },
        { frameworkType: Frameworks.CLEA, id: cleaComplementaryCertificationId },
      ],
      candidateIds,
    });

    await databaseBuilder.commit();

    const certificationCandidateDataBefore = await knex('certification-candidates').orderBy('id');
    expect(certificationCandidateDataBefore.length).to.equal(6);
    for (let i = 0; i < 6; i++) {
      expect(certificationCandidateDataBefore[i].subscription).to.be.null;
    }

    const expectedSubscriptions = [
      Frameworks.CORE,
      Frameworks.DROIT,
      Frameworks.CLEA,
      Frameworks.CORE,
      Frameworks.DROIT,
      Frameworks.CLEA,
    ];

    await script.handle({
      options: { dryRun: false, startId: certificationCandidateDataBefore[0].id, chunkSize: 2 },
      logger,
    });

    const certificationCandidateDataAfter = await knex('certification-candidates').orderBy('id');

    expect(certificationCandidateDataAfter.length).to.equal(6);

    for (let i = 0; i < 6; i++) {
      expect(certificationCandidateDataAfter[i].subscription).to.equal(expectedSubscriptions[i]);
    }
  });

  it('should not update certification candidates that already have the informations', async function () {
    const candidateId = databaseBuilder.factory.buildCertificationCandidate({
      subscription: 'CORE',
    }).id;

    databaseBuilder.factory.buildCoreSubscription({
      certificationCandidateId: candidateId,
    });

    await databaseBuilder.commit();

    const certificationCandidateDataBefore = await knex('certification-candidates').first();
    expect(certificationCandidateDataBefore.subscription).to.equal('CORE');

    await script.handle({
      options: { dryRun: false, startId: candidateId, chunkSize: 2 },
      logger,
    });

    expect(logger.info.getCall(0)).to.have.been.calledWithExactly('Script execution started');
    expect(logger.info.getCall(1)).to.have.been.calledWithExactly(
      'No more certification candidates to process, youpi !',
    );
  });

  it('should provide appropriate logger informations', async function () {
    const candidateIds = [];

    _createCertificationCandidates({
      subscriptions: [
        { frameworkType: Frameworks.CORE, id: null },
        { frameworkType: Frameworks.CORE, id: null },
        { frameworkType: Frameworks.CORE, id: null },
        { frameworkType: Frameworks.CORE, id: null },
      ],
      candidateIds,
    });
    await databaseBuilder.commit();

    await script.handle({ options: { dryRun: false, startId: candidateIds[0], chunkSize: 2 }, logger });

    expect(logger.info.getCall(0)).to.have.been.calledWithExactly('Script execution started');
    expect(logger.info.getCall(1)).to.have.been.calledWithExactly(
      `Processing certification candidate from ${candidateIds[0]} to ${candidateIds[1]}...`,
    );
    expect(logger.info.getCall(2)).to.have.been.calledWithExactly(
      `Certification candidates up until ID ${candidateIds[1]} DONE`,
    );
    expect(logger.info.getCall(3)).to.have.been.calledWithExactly(
      `Processing certification candidate from ${candidateIds[2]} to ${candidateIds[3]}...`,
    );
    expect(logger.info.getCall(4)).to.have.been.calledWithExactly(
      `Certification candidates up until ID ${candidateIds[3]} DONE`,
    );
    expect(logger.info.getCall(5)).to.have.been.calledWithExactly(
      'No more certification candidates to process, youpi !',
    );
  });
});

function _createCertificationCandidates({ reconciledAt, subscriptions, candidateIds = [] }) {
  const sessionId = databaseBuilder.factory.buildSession().id;

  for (const subscription of subscriptions) {
    const userId = databaseBuilder.factory.buildUser().id;
    const candidateId = databaseBuilder.factory.buildCertificationCandidate({
      sessionId,
      reconciledAt,
      userId,
    }).id;

    if (subscription.frameworkType == Frameworks.CORE || subscription.frameworkType == Frameworks.CLEA) {
      databaseBuilder.factory.buildCoreSubscription({
        certificationCandidateId: candidateId,
      });
    }
    if (subscription.frameworkType != Frameworks.CORE) {
      databaseBuilder.factory.buildComplementaryCertificationSubscription({
        certificationCandidateId: candidateId,
        complementaryCertificationId: subscription.id,
      });
    }

    candidateIds.push(candidateId);
  }
}
