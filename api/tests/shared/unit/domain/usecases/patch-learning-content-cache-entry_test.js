import { patchLearningContentCacheEntry } from '../../../../../src/shared/domain/usecases/patch-learning-content-cache-entry.js';
import * as LearningContentDatasources from '../../../../../src/shared/infrastructure/datasources/learning-content/index.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Domain | Usecase | Patch learning content cache entry', function () {
  describe('#patchLearningContentCacheEntry', function () {
    context('when entry is already in cache', function () {
      it('should patch learning content cache with provided updated entry', async function () {
        // given
        const recordId = 'recId';
        const updatedRecord = Symbol('updated record');
        const modelName = 'someModelName';
        const LearningContentCache = {
          instance: {
            get: sinon.stub(),
            patch: sinon.stub(),
          },
        };
        const learningContent = {
          someModelName: [
            { attr1: 'attr1 value index 0', id: 'otherRecordId' },
            { attr1: 'attr1 value index 1', id: recordId },
          ],
          someOtherModelName: [{ other: 'entry', id: recordId }],
        };
        LearningContentCache.instance.get.resolves(learningContent);

        // when
        await patchLearningContentCacheEntry({
          recordId,
          updatedRecord,
          modelName,
          LearningContentCache,
          LearningContentDatasources,
        });

        // then
        expect(LearningContentCache.instance.patch).to.have.been.calledWithExactly({
          operation: 'assign',
          path: 'someModelName[1]',
          value: updatedRecord,
        });
      });
    });
    context('when entry is not in cache', function () {
      it('should patch learning content cache by adding provided entry', async function () {
        // given
        const recordId = 'recId';
        const updatedRecord = Symbol('updated record');
        const modelName = 'someModelName';
        const LearningContentCache = {
          instance: {
            get: sinon.stub(),
            patch: sinon.stub(),
          },
        };
        const learningContent = {
          someModelName: [
            { attr1: 'attr1 value index 0', id: 'otherRecordId' },
            { attr1: 'attr1 value index 1', id: 'yetAnotherRecordId' },
          ],
          someOtherModelName: [{ other: 'entry', id: recordId }],
        };
        LearningContentCache.instance.get.resolves(learningContent);

        // when
        await patchLearningContentCacheEntry({ recordId, updatedRecord, modelName, LearningContentCache });

        // then
        expect(LearningContentCache.instance.patch).to.have.been.calledWithExactly({
          operation: 'push',
          path: 'someModelName',
          value: updatedRecord,
        });
      });
    });
  });
});
