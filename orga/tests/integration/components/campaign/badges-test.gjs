import { render } from '@1024pix/ember-testing-library';
import Badges from 'pix-orga/components/campaign/badges';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Campaign | Badges', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should render badge images for each one', async function (assert) {
    // given
    const badges = [
      { id: 1, title: 'badge1', imageUrl: 'img1.svg', altMessage: 'alt-img1' },
      { id: 2, title: 'badge2', imageUrl: 'img2.svg', altMessage: 'alt-img2' },
    ];
    const acquiredBadges = [];
    // when
    const screen = await render(<template><Badges @badges={{badges}} @acquiredBadges={{acquiredBadges}} /></template>);
    // then
    const badgeImages = screen.getAllByRole('img');
    assert.strictEqual(badgeImages.length, 2);
    assert.strictEqual(badgeImages[0].getAttribute('src'), 'img1.svg');
    assert.strictEqual(badgeImages[0].getAttribute('alt'), 'alt-img1');

    assert.strictEqual(badgeImages[1].getAttribute('src'), 'img2.svg');
    assert.strictEqual(badgeImages[1].getAttribute('alt'), 'alt-img2');
  });

  test('should render unacquired in the title', async function (assert) {
    // given
    const badges = [{ title: 'badge1', imageUrl: 'img1', altMessage: 'alt-img1' }];
    const acquiredBadges = [];

    // when
    const screen = await render(<template><Badges @badges={{badges}} @acquiredBadges={{acquiredBadges}} /></template>);

    // then
    assert.ok(screen.getByText(/badge1 - Non acquis/i));
  });
  test('should render acquired in the title', async function (assert) {
    // given
    const badges = [{ title: 'badge1', imageUrl: 'img1', altMessage: 'alt-img1' }];
    const acquiredBadges = [badges[0]];

    // when
    const screen = await render(<template><Badges @badges={{badges}} @acquiredBadges={{acquiredBadges}} /></template>);

    // then
    assert.ok(screen.getByText(/badge1 - Acquis/i));
  });
});
