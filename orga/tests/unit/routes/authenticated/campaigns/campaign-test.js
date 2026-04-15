import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/campaigns/campaign', function (hooks) {
  setupTest(hooks);

  test('should called campaign model with params', async function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/campaigns/campaign');
    const store = this.owner.lookup('service:store');

    const params = { campaign_id: 'liste' };

    const findRecordStub = sinon.stub(store, 'findRecord');
    const replaceWithStub = sinon.stub();
    route.router.replaceWith = replaceWithStub;

    // when
    await route.model(params);

    // then
    assert.ok(findRecordStub.calledWithExactly('campaign', 'liste'));
    assert.notOk(replaceWithStub.called);
  });

  test('should redirect to not-found page', async function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/campaigns/campaign');
    const store = this.owner.lookup('service:store');

    const params = { campaign_id: 'liste' };
    const expectedRedirection = 'not-found';

    const findRecordStub = sinon.stub(store, 'findRecord');
    const replaceWithStub = sinon.stub();

    findRecordStub.withArgs('campaign', 'liste').rejects(new Error('400'));

    route.router.replaceWith = replaceWithStub;

    // when
    await route.model(params);

    // then
    assert.ok(replaceWithStub.calledWithExactly(expectedRedirection, 'liste'));
  });
});
