import { setupTest } from 'ember-qunit';
import DisplayCampaignErrors from 'pix-orga/helpers/display-campaign-errors';
import { module, test } from 'qunit';

import setupIntl from '../../helpers/setup-intl';

module('Unit | Helper | display-campaign-errors', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  let helper;
  hooks.beforeEach(function () {
    this.owner.lookup('service:locale').setCurrentLocale('fr');
    helper = new DisplayCampaignErrors(this.owner);
  });

  module('when there is an error', function () {
    test('it returns the intlKey corresponding to the name error message', function (assert) {
      const nameErrors = [{ attribute: 'name', message: 'CAMPAIGN_NAME_IS_REQUIRED' }];
      assert.strictEqual(helper.compute([nameErrors]), 'Veuillez donner un nom à votre campagne.');
    });
  });

  module('when there is no error', function () {
    test('it returns the intlKey corresponding to the type error message', function (assert) {
      const noError = [];
      assert.strictEqual(helper.compute([noError]), null);
    });
  });
});
