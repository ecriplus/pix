import { challengeRepository } from '../../../../../src/certification/session-management/infrastructure/repositories/index.js';
import { ComplementaryCertificationKeys } from '../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { Frameworks } from '../../../../../src/certification/shared/domain/models/Frameworks.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Shared | Infrastructure | Repositories | challenge-repository', function () {
  let findStub, dependencies;

  beforeEach(function () {
    findStub = sinon.stub();
    dependencies = {
      getInstance: () => {
        return { find: findStub };
      },
    };
  });

  describe('findActiveFlashCompatible', function () {
    context('when fetching a certification referential', function () {
      context('when it is the CORE referential', function () {
        it('should have a CORE cache key', async function () {
          // given
          findStub.resolves([]);

          // when
          await challengeRepository.findActiveFlashCompatible({
            date: new Date(),
            locale: 'fr',
            successProbabilityThreshold: false,
            accessibilityAdjustmentNeeded: false,
            complementaryCertificationKey: undefined,
            dependencies,
          });

          // then
          const expectedCacheKey = `findActiveFlashCompatible({ scope: ${Frameworks.CORE}, locale: fr, accessibilityAdjustmentNeeded: false })`;
          expect(findStub).to.have.been.calledOnceWithExactly(expectedCacheKey, sinon.match.func);
        });
      });

      context('when it is a double certification', function () {
        it('should have a CORE cache key', async function () {
          // given
          findStub.resolves([]);

          // when
          await challengeRepository.findActiveFlashCompatible({
            date: new Date(),
            locale: 'fr',
            successProbabilityThreshold: false,
            accessibilityAdjustmentNeeded: false,
            complementaryCertificationKey: ComplementaryCertificationKeys.CLEA,
            dependencies,
          });

          // then
          const expectedCacheKey = `findActiveFlashCompatible({ scope: ${Frameworks.CORE}, locale: fr, accessibilityAdjustmentNeeded: false })`;
          expect(findStub).to.have.been.calledOnceWithExactly(expectedCacheKey, sinon.match.func);
        });
      });
    });
  });
});
