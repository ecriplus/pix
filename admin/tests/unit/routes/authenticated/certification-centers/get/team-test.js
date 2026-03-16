import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/certification-centers/get/team', function (hooks) {
  setupTest(hooks);

  test('it should return certification center memberships', async function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/certification-centers/get/team');

    const certificationCenterMemberships = Symbol('some certification center memberships');
    const certificationCenter = {
      id: 777,
      isArchived: false,
      certificationCenterMemberships,
      hasMany: sinon.stub().returns({ reload: sinon.stub().resolves() }),
    };

    route.modelFor = sinon.stub();
    route.modelFor.withArgs('authenticated.certification-centers.get').returns({ certificationCenter });

    // when
    const result = await route.model();

    // then
    sinon.assert.calledWith(certificationCenter.hasMany, 'certificationCenterMemberships');
    assert.strictEqual(result.certificationCenterMemberships, certificationCenterMemberships);
    assert.strictEqual(result.certificationCenterId, 777);
  });
});
