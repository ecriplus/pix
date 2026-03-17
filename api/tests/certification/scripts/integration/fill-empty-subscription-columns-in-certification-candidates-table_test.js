import { FillEmptySubscriptionColumnsInCertificationCandidatesTable } from '../../../../scripts/certification/fill-empty-subscription-columns-in-certification-candidates-table.js';
import { Frameworks } from '../../../../src/certification/configuration/domain/models/Frameworks.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Certification | Scripts | Fill empty subscription columns in certification candidate tables', function () {
  let logger, script;

  beforeEach(function () {
    logger = { info: sinon.stub(), error: sinon.stub() };
    script = new FillEmptySubscriptionColumnsInCertificationCandidatesTable();
  });

  it('should not commit if dryRun', async function () {
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCandidate({
      userId,
    });

    await databaseBuilder.commit();

    const certificationCandidateDataBefore = await knex('certification-candidates').first();
    expect(certificationCandidateDataBefore.subscription).to.be.null;

    await script.handle({ options: { dryRun: true, throttleDelay: 1, startId: 0, chunkSize: 1 }, logger });

    const certificationCandidateDataAfter = await knex('certification-candidates').first();
    expect(certificationCandidateDataAfter.subscription).to.be.null;
  });

  it('should fill subscription in certification candidate', async function () {
    const droitComplementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification.droit().id;
    const cleaComplementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification.clea().id;

    const candidateForCore = databaseBuilder.factory.buildCertificationCandidate();
    databaseBuilder.factory.buildCoreSubscription({
      certificationCandidateId: candidateForCore.id,
    });

    const candidateForDroit = databaseBuilder.factory.buildCertificationCandidate();
    databaseBuilder.factory.buildComplementaryCertificationSubscription({
      certificationCandidateId: candidateForDroit.id,
      complementaryCertificationId: droitComplementaryCertificationId,
    });

    const candidateForClea = databaseBuilder.factory.buildCertificationCandidate();
    databaseBuilder.factory.buildComplementaryCertificationSubscription({
      certificationCandidateId: candidateForClea.id,
      complementaryCertificationId: cleaComplementaryCertificationId,
    });
    databaseBuilder.factory.buildCoreSubscription({
      certificationCandidateId: candidateForClea.id,
    });

    await databaseBuilder.commit();

    const certificationCandidateDataBefore = await knex('certification-candidates').orderBy('id');
    expect(certificationCandidateDataBefore.length).to.equal(3);
    for (let i = 0; i < 3; i++) {
      expect(certificationCandidateDataBefore[i].subscription).to.be.null;
    }

    const expectedSubscriptions = [Frameworks.CORE, Frameworks.DROIT, Frameworks.CLEA];

    await script.handle({
      options: { dryRun: false, throttleDelay: 1, startId: certificationCandidateDataBefore[0].id, chunkSize: 2 },
      logger,
    });

    const certificationCandidateDataAfter = await knex('certification-candidates').orderBy('id');

    expect(certificationCandidateDataAfter.length).to.equal(3);

    for (let i = 0; i < 3; i++) {
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
      options: { dryRun: false, throttleDelay: 1, startId: candidateId, chunkSize: 2 },
      logger,
    });

    expect(logger.info.getCall(0)).to.have.been.calledWithExactly('Script execution started');
    expect(logger.info.getCall(1)).to.have.been.calledWithExactly(
      'No more certification candidates to process, youpi !',
    );
  });

  it('should provide appropriate logger informations', async function () {
    const candidateIds = [];

    let candidateForCore;
    for (let i = 0; i < 4; i++) {
      candidateForCore = databaseBuilder.factory.buildCertificationCandidate();
      databaseBuilder.factory.buildCoreSubscription({
        certificationCandidateId: candidateForCore.id,
      });
      candidateIds.push(candidateForCore.id);
    }

    await databaseBuilder.commit();

    await script.handle({
      options: { dryRun: false, throttleDelay: 1, startId: candidateIds[0], chunkSize: 2 },
      logger,
    });

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
