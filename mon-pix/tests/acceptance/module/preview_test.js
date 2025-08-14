import { fillByLabel, visit } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import setupIntl from '../../helpers/setup-intl';

module('Acceptance | Module | Routes | Preview', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test('should allow to preview module', async function (assert) {
    // given
    const screen = await visit('/modules/preview');

    // when
    await click(screen.getByRole('button', { name: 'Afficher le JSON' }));
    await fillByLabel(
      'Contenu du Module',
      '{ "sections": [{ "id": "1", "type": "blank", "grains": [{ "id":"1", "type": "lesson", "title": "Preview", "components": [{ "type": "element", "element": {"type": "text", "content": "Preview du module" }}] }] }] }',
    );

    // then
    assert.strictEqual(currentURL(), '/modules/preview');
    assert.dom(screen.getByText('Preview du module')).exists();
  });
});
