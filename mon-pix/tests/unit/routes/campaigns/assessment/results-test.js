import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | Campaign | Assessment | Results', function (hooks) {
  setupTest(hooks);

  let route, modelForStub, transitionToStub, queryRecordStub, queryStub;
  const campaign = { id: '123456', code: 'NEW_CODE' };
  const questResults = [{ obtained: true, reward: { key: 'reward-key' } }];
  const campaignParticipation = { id: '1212', isShared: true, hasMany: sinon.stub() };
  const campaignParticipationResult = { id: campaignParticipation.id, campaignId: campaign.id };

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:campaigns.assessment.results');
    const store = this.owner.lookup('service:store');

    modelForStub = sinon.stub(route, 'modelFor');
    transitionToStub = sinon.stub(route.router, 'transitionTo');
    modelForStub.returns({ campaign, campaignParticipation });
    queryRecordStub = sinon.stub(store, 'queryRecord');
    queryStub = sinon.stub(store, 'query');

    campaignParticipation.hasMany.returns({ reload: sinon.stub() });
  });

  module('#model', function () {
    module('when no participation', function () {
      test('should redirect to start or resume', async function (assert) {
        class CurrentUserStub extends Service {
          user = {
            id: '1234',
          };
        }
        this.owner.register('service:current-user', CurrentUserStub);

        queryRecordStub
          .withArgs('campaign-participation-result', { campaignId: campaign.id, userId: '1234' })
          .rejects({ errors: [{ status: '412' }] });

        await route.model();
        sinon.assert.calledWith(transitionToStub, 'campaigns.entry-point', 'NEW_CODE');
        assert.ok(true);
      });
    });

    module('when participation exists', function () {
      test('should call quest result on connected user', async function (assert) {
        class CurrentUserStub extends Service {
          user = {
            id: '1234',
            isAnonymous: false,
          };
        }
        this.owner.register('service:current-user', CurrentUserStub);

        queryRecordStub
          .withArgs('campaign-participation-result', { campaignId: campaign.id, userId: '1234' })
          .resolves(campaignParticipationResult);
        queryStub
          .withArgs('quest-result', { campaignParticipationId: campaignParticipationResult.id })
          .resolves(questResults);

        await route.model();

        assert.true(
          queryStub.withArgs('quest-result', { campaignParticipationId: campaignParticipationResult.id }).called,
        );
      });

      test('should not call quest result on anonymous user', async function (assert) {
        class CurrentUserStub extends Service {
          user = {
            id: '1234',
            isAnonymous: true,
          };
        }
        this.owner.register('service:current-user', CurrentUserStub);

        queryRecordStub
          .withArgs('campaign-participation-result', { campaignId: campaign.id, userId: '1234' })
          .resolves(campaignParticipationResult);
        queryStub
          .withArgs('quest-result', { campaignParticipationId: campaignParticipationResult.id })
          .resolves(questResults);

        await route.model();

        assert.false(
          queryStub.withArgs('quest-result', { campaignParticipationId: campaignParticipationResult.id }).called,
        );
      });

      test('should not redirect', async function (assert) {
        class CurrentUserStub extends Service {
          user = {
            id: '1234',
            isAnonymous: false,
          };
        }
        this.owner.register('service:current-user', CurrentUserStub);

        queryRecordStub
          .withArgs('campaign-participation-result', { campaignId: campaign.id, userId: '1234' })
          .resolves(campaignParticipationResult);
        queryStub
          .withArgs('quest-result', { campaignParticipationId: campaignParticipationResult.id })
          .resolves(questResults);

        await route.model();

        sinon.assert.notCalled(route.router.transitionTo);
        assert.ok(true);
      });
    });
  });
});
