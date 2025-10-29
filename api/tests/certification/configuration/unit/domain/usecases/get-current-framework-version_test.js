import { getCurrentFrameworkVersion } from '../../../../../../src/certification/configuration/domain/usecases/get-current-framework-version.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | get-current-framework-version', function () {
  let versionsRepository, frameworkChallengesRepository, learningContentRepository;

  beforeEach(function () {
    versionsRepository = {
      findActiveByScope: sinon.stub(),
    };

    frameworkChallengesRepository = {
      getByVersionId: sinon.stub(),
    };

    learningContentRepository = {
      getFrameworkReferential: sinon.stub(),
    };
  });

  it('should return the current framework', async function () {
    // given
    const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;
    const versionId = 123;
    const version = domainBuilder.certification.configuration.buildVersion({
      id: versionId,
      scope: complementaryCertificationKey,
    });

    const challenges = [
      domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
        versionId,
        challengeId: 'rec1',
      }),
    ];

    versionsRepository.findActiveByScope.withArgs({ scope: complementaryCertificationKey }).resolves(version);

    frameworkChallengesRepository.getByVersionId.withArgs({ versionId }).resolves(challenges);

    const area = domainBuilder.buildArea();
    learningContentRepository.getFrameworkReferential.resolves([area]);

    // when
    const results = await getCurrentFrameworkVersion({
      complementaryCertificationKey,
      versionsRepository,
      frameworkChallengesRepository,
      learningContentRepository,
    });

    // then
    expect(versionsRepository.findActiveByScope).to.have.been.calledOnceWithExactly({
      scope: complementaryCertificationKey,
    });

    expect(frameworkChallengesRepository.getByVersionId).to.have.been.calledOnceWithExactly({ versionId });

    expect(learningContentRepository.getFrameworkReferential).to.have.been.calledOnceWithExactly({
      challengeIds: ['rec1'],
    });

    expect(results.scope).to.equal(complementaryCertificationKey);
    expect(results.versionId).to.equal(versionId);
    expect(results.areas).to.deep.equal([area]);
  });

  it('should throw NotFoundError when no active version exists', async function () {
    // given
    const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;

    versionsRepository.findActiveByScope.withArgs({ scope: complementaryCertificationKey }).resolves(null);

    // when
    const error = await catchErr(getCurrentFrameworkVersion)({
      complementaryCertificationKey,
      versionsRepository,
      frameworkChallengesRepository,
      learningContentRepository,
    });

    // then
    expect(error).to.be.instanceOf(NotFoundError);
    expect(error.message).to.equal(`There is no framework for complementary ${complementaryCertificationKey}`);
  });
});
