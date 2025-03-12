import { render } from '@1024pix/ember-testing-library';
import CampaignStep from 'mon-pix/components/campaigns/assessment/start-landing-page/campaign-step';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../../helpers/setup-intl-rendering';

module('Integration | Components | Campaigns | Assessment | Start Landing Page | Campaign Step', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it displays an image, a title and a description', async function (assert) {
    // given
    const step = {
      description: 'ma super description',
      image: {
        alt: 'mon alt',
        src: 'path',
      },
      title: 'mon titre',
    };

    // when
    const screen = await render(<template><CampaignStep @step={{step}} /></template>);

    // then
    assert.dom(screen.getByRole('presentation')).hasAttribute('src', step.image.src);
    assert.dom(screen.getByRole('heading', { level: 3, name: step.title }));
    assert.dom(screen.getByText('ma super description'));
  });
});
