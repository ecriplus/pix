# Ember

## General

### Using transitionTo

Avoid `transitionTo` calls in the `model()` hook. Prefer using them in `afterModel()`, once the model is loaded.

```javascript
// BAD
export default Route.extend({
  model() {
    const store = this.get('store');
    return store.findRecord('user', this.get('session.data.authenticated.userId'))
      .then((user) => {
        if (user.get('organizations.length') > 0) {
          return this.transitionTo('board');
        }
        return user;
      });
  },
});

// GOOD
export default Route.extend({
  model() {
    return this.store.findRecord('user', this.get('session.data.authenticated.userId'));
  },

  afterModel(model) {
    if (model.get('organizations.length') > 0) {
      return this.transitionTo('board');
    }
  }
});
```

## Tests

### Testing text translated by EmberIntl

In order to be completely agnostic about the locale of the test environment, it is preferred to test translated texts by going
through the `t` `helper` provided by `ember-intl/test-support`. This way, the language constraint is lifted and the focus is placed
on the expected translation key for a given test ([approach documented in the EmberIntl documentation](https://ember-intl.github.io/ember-intl/versions/master/docs/guide/testing#t-key-options-)).

To test translated texts in templates:
```js
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl, t } from 'ember-intl/test-support';

module('Integration | Component | hello', function(hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);
  
  test('it should display a welcome message', async function (assert) {
    // when
    await render(hbs`<Hello/>`);

    // then
    assert.dom().hasText(t('pages.hello.welcome-message'));
  });
});
```

Likewise, for any other text translated by another means:
```js
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupIntl, t } from 'ember-intl/test-support';

module('Unit | Service | Error messages', function(hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('should return the message when error code is found', function(assert) {
    // given
    const errorMessages = this.owner.lookup('service:errorMessages');
    
    // when
    const message = errorMessages.getErrorMessage('CAMPAIGN_NAME_IS_REQUIRED');
    
    // then
    assert.equal(message, t('api-error-messages.campaign-creation.name-required'));
  });
});
```

Finally, if you really want to test a specific translation, you must specify the locale during test setup:
```js
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupIntl, t } from 'ember-intl/test-support';

module('Unit | Service | Error messages', function(hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'fr-fr');

  test('should return the message when error code is found', function(assert) {
    // given
    const errorMessages = this.owner.lookup('service:errorMessages');
    
    // when
    const message = errorMessages.getErrorMessage('CAMPAIGN_NAME_IS_REQUIRED');
    
    // then
    assert.equal(message, 'Campaign name is required');
  });
});
```
*Note: This practice is not recommended except in exceptional cases*
