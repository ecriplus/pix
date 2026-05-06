import sinon from 'sinon';

import { getVersionById } from '../../../../../../src/certification/configuration/domain/usecases/get-version-by-id.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { expect } from '../../../../../test-helper.js';
import { domainBuilder } from '../../../../../tooling/domain-builder/domain-builder.js';
import { catchErr } from '../../../../../tooling/test-utils/error.js';

describe('Certification | Configuration | Unit | UseCase | get-version-by-id', function () {
  let versionRepository, frameworkChallengesRepository, learningContentRepository;

  beforeEach(function () {
    versionRepository = { getById: sinon.stub() };
    frameworkChallengesRepository = { getByVersionId: sinon.stub() };
    learningContentRepository = { getFrameworkReferential: sinon.stub() };
  });

  it('should return version with its areas', async function () {
    // given
    const versionId = 42;
    const version = domainBuilder.certification.configuration.buildVersion({ id: versionId });
    const challenges = [
      domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
        versionId,
        challengeId: 'recChallenge1',
      }),
    ];
    const area = domainBuilder.buildArea();

    versionRepository.getById.withArgs({ id: versionId }).resolves(version);
    frameworkChallengesRepository.getByVersionId.withArgs({ versionId }).resolves(challenges);
    learningContentRepository.getFrameworkReferential.resolves([area]);

    // when
    const result = await getVersionById({
      id: versionId,
      versionRepository,
      frameworkChallengesRepository,
      learningContentRepository,
    });

    // then
    expect(versionRepository.getById).to.have.been.calledOnceWithExactly({ id: versionId });
    expect(frameworkChallengesRepository.getByVersionId).to.have.been.calledOnceWithExactly({ versionId });
    expect(learningContentRepository.getFrameworkReferential).to.have.been.calledOnceWithExactly({
      challengeIds: ['recChallenge1'],
    });
    expect(result.version).to.equal(version);
    expect(result.areas).to.deep.equal([area]);
  });

  it('should throw NotFoundError when no version exists for the given id', async function () {
    // given
    versionRepository.getById.resolves(null);

    // when
    const error = await catchErr(getVersionById)({
      id: 99,
      versionRepository,
      frameworkChallengesRepository,
      learningContentRepository,
    });

    // then
    expect(error).to.be.instanceOf(NotFoundError);
    expect(error.message).to.equal('No certification version found for id: 99');
  });
});
