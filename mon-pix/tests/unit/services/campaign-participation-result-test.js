import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Service | campaign-participation-result', function (hooks) {
  setupTest(hooks);
  let campaignParticipationResultService, campaignParticipationResultAdapter;

  hooks.beforeEach(function () {
    const store = this.owner.lookup('service:store');
    campaignParticipationResultService = this.owner.lookup('service:campaign-participation-result');
    campaignParticipationResultAdapter = store.adapterFor('campaign-participation-result');
  });

  module('when there is no questsResults', function () {
    test('it should only share campaign', async function (assert) {
      // given
      const campaignParticipationId = Symbol('campaignParticipationId');
      const questResults = [];
      const shareStub = sinon.stub(campaignParticipationResultAdapter, 'share');
      const shareProfileRewardStub = sinon.stub(campaignParticipationResultAdapter, 'shareProfileReward');

      //when
      await campaignParticipationResultService.share(campaignParticipationId, questResults);

      // then
      assert.true(shareStub.calledOnce);
      assert.false(shareProfileRewardStub.calledOnce);
    });
  });

  module('when there is at least one questsResult', function () {
    test('it should share campaign and profile reward', async function (assert) {
      // given
      const campaignParticipationId = Symbol('campaignParticipationId');
      const questResults = [{ obtained: true }];
      const shareStub = sinon.stub(campaignParticipationResultAdapter, 'share');
      const shareProfileRewardStub = sinon.stub(campaignParticipationResultAdapter, 'shareProfileReward');

      //when
      await campaignParticipationResultService.share(campaignParticipationId, questResults);

      // then
      assert.true(shareStub.calledOnce);
      assert.true(shareProfileRewardStub.calledOnce);
    });
  });
});
