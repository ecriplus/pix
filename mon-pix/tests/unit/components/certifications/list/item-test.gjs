import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import createGlimmerComponent from '../../../../helpers/create-glimmer-component';

module('Unit | Component | Certifications | List | item', function (hooks) {
  setupTest(hooks);

  module('when domain is french', function () {
    test('should call file saver with isFrenchDomainExtension set to true in url', async function (assert) {
      // given
      const domainService = this.owner.lookup('service:currentDomain');
      sinon.stub(domainService, 'getExtension').returns('fr');

      const fileSaverSaveStub = sinon.stub();
      class FileSaverStub extends Service {
        save = fileSaverSaveStub;
      }
      this.owner.register('service:fileSaver', FileSaverStub);

      const component = createGlimmerComponent('certifications/list/item');
      component.args.certification = { id: 1234 };

      // when
      await component.downloadAttestation();

      // then
      sinon.assert.calledWith(fileSaverSaveStub, {
        url: '/api/attestation/1234?isFrenchDomainExtension=true&lang=fr',
        token: undefined,
      });
      assert.ok(true);
    });
  });

  module('when domain is not french', function () {
    test('should call file saver with isFrenchDomainExtension set to false in url', async function (assert) {
      // given
      const fileSaverSaveStub = sinon.stub();
      class FileSaverStub extends Service {
        save = fileSaverSaveStub;
      }
      this.owner.register('service:fileSaver', FileSaverStub);

      const component = createGlimmerComponent('certifications/list/item');
      component.args.certification = { id: 1234 };

      // when
      await component.downloadAttestation();

      // then
      sinon.assert.calledWith(fileSaverSaveStub, {
        url: '/api/attestation/1234?isFrenchDomainExtension=false&lang=fr',
        token: undefined,
      });
      assert.ok(true);
    });
  });
});
