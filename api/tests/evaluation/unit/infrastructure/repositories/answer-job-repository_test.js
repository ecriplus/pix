import { AnswerJobRepository } from '../../../../../src/evaluation/infrastructure/repositories/answer-job-repository.js';
import { config } from '../../../../../src/shared/config.js';
import { DomainTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { featureToggles } from '../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { expect, knex, sinon } from '../../../../test-helper.js';

describe('Evaluation | Unit | Infrastructure | Repositories | AnswerJobRepository', function () {
  beforeEach(async function () {
    sinon.stub(config, 'featureToggles');
    sinon.stub(knex, 'batchInsert').callsFake(() => ({
      transacting: sinon.stub().resolves([{ rowCount: 1 }]),
    }));
    await featureToggles.set('isQuestEnabled', true);
    config.featureToggles.isAsyncQuestRewardingCalculationEnabled = true;
  });

  describe('#performAsync', function () {
    it('should do nothing if quests are disabled', async function () {
      // given
      const profileRewardTemporaryStorageStub = { increment: sinon.stub() };
      const knexStub = { batchInsert: sinon.stub().resolves([]) };
      sinon.stub(DomainTransaction, 'getConnection').returns(knexStub);
      sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
        return callback();
      });
      await featureToggles.set('isQuestEnabled', false);
      const userId = Symbol('userId');
      const answerJobRepository = new AnswerJobRepository({
        dependencies: { profileRewardTemporaryStorage: profileRewardTemporaryStorageStub },
      });

      // when
      await answerJobRepository.performAsync({ userId });

      // then
      expect(profileRewardTemporaryStorageStub.increment).not.to.have.been.called;
    });

    it('should do nothing if quests are in sync mode', async function () {
      // given
      const profileRewardTemporaryStorageStub = { increment: sinon.stub() };
      const knexStub = { batchInsert: sinon.stub().resolves([]) };
      sinon.stub(DomainTransaction, 'getConnection').returns(knexStub);
      sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
        return callback();
      });
      config.featureToggles.isAsyncQuestRewardingCalculationEnabled = false;
      const userId = Symbol('userId');
      const answerJobRepository = new AnswerJobRepository({
        dependencies: { profileRewardTemporaryStorage: profileRewardTemporaryStorageStub },
      });

      // when
      await answerJobRepository.performAsync({ userId });

      // then
      expect(profileRewardTemporaryStorageStub.increment).not.to.have.been.called;
    });

    it("should increment user's jobs count in temporary storage", async function () {
      // given
      const profileRewardTemporaryStorageStub = { increment: sinon.stub() };
      const knexStub = { batchInsert: sinon.stub().resolves([]) };
      sinon.stub(DomainTransaction, 'getConnection').returns(knexStub);
      sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
        return callback();
      });
      const userId = Symbol('userId');
      const answerJobRepository = new AnswerJobRepository({
        dependencies: { profileRewardTemporaryStorage: profileRewardTemporaryStorageStub },
      });

      // when
      await answerJobRepository.performAsync({ userId });

      // then
      expect(profileRewardTemporaryStorageStub.increment).to.have.been.calledWith(userId);
    });

    describe('should use transaction in all cases', function () {
      it('should use existing transaction', async function () {
        // given
        const profileRewardTemporaryStorageStub = { increment: sinon.stub() };
        const knexStub = { batchInsert: sinon.stub().resolves([]), isTransaction: true };
        sinon.stub(DomainTransaction, 'getConnection').returns(knexStub);
        sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
          return callback();
        });
        const userId = Symbol('userId');
        const answerJobRepository = new AnswerJobRepository({
          dependencies: { profileRewardTemporaryStorage: profileRewardTemporaryStorageStub },
        });

        // when
        await answerJobRepository.performAsync({ userId });

        // then
        expect(DomainTransaction.execute).to.have.not.been.called;
      });

      it('should create new transaction', async function () {
        // given
        const profileRewardTemporaryStorageStub = { increment: sinon.stub() };
        const knexStub = { batchInsert: sinon.stub().resolves([]), isTransaction: false };
        sinon.stub(DomainTransaction, 'getConnection').returns(knexStub);
        sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
          return callback();
        });
        const userId = Symbol('userId');
        const answerJobRepository = new AnswerJobRepository({
          dependencies: { profileRewardTemporaryStorage: profileRewardTemporaryStorageStub },
        });

        // when
        await answerJobRepository.performAsync({ userId });

        // then
        expect(DomainTransaction.execute).to.have.been.called;
      });
    });
  });
});
