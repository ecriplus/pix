import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import sinon from 'sinon';

module('Unit | Route | authenticated/campaigns/update', function (hooks) {
  setupTest(hooks);

  test('should return members list sorted by full name', async function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/campaigns/update');

    route.currentUser = { organization: { id: 123 } };

    const member1 = EmberObject.create({
      firstName: 'Alice',
      lastName: 'Delamer',
    });
    const member2 = EmberObject.create({
      firstName: 'Alice',
      lastName: 'Delamare',
    });
    const campaign = EmberObject.create({ ownerFirstName: 'Marc', ownerLastName: 'Dupont' });
    const queryStub = sinon.stub();
    const findRecordStub = sinon.stub();
    const storeStub = {
      findAll: queryStub.resolves([member1, member2]),
      findRecord: findRecordStub.resolves(campaign),
    };
    route.store = storeStub;

    const params = {
      pageNumber: 1,
      pageSize: 2,
    };

    // when
    const result = await route.model(params);

    //then
    assert.strictEqual(result.membersSortedByFullName[0].lastName, 'Delamare');
    assert.strictEqual(result.membersSortedByFullName[1].lastName, 'Delamer');
  });
});
