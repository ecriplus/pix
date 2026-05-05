import { render } from "@1024pix/ember-testing-library";
import FrameworkHistory from "pix-admin/components/certification-frameworks/item/framework/framework-history";
import { module, test } from "qunit";

import setupIntlRenderingTest, { t } from "../../../../../helpers/setup-intl-rendering";

module('Integration | Component | Complementary certifications/Item/Framework | Framework history', function (hooks) {
  setupIntlRenderingTest(hooks);

  let intl;

  hooks.beforeEach(function () {
    intl = this.owner.lookup('service:intl');
  });

  test('it should display the framework history', async function (assert) {
    // given
    const frameworkHistory = [
      {
        id: 456,
        startDate: new Date('2023-10-10'),
        expirationDate: null,
        assessmentDuration: 90,
        maximumAssessmentLength: 32,
        status: 'ACTIVE',
      },
      {
        id: 123,
        startDate: new Date('2020-01-01'),
        expirationDate: new Date('2021-06-15'),
        assessmentDuration: 105,
        maximumAssessmentLength: 32,
        status: 'ARCHIVED',
      },
    ];

    // when
    const screen = await render(<template><FrameworkHistory @history={{frameworkHistory}} /></template>);

    // then
    assert
      .dom(
        screen.getByRole('table', {
          name: t('components.complementary-certifications.item.framework.history.table.caption'),
        }),
      )
      .exists();

    assert.strictEqual(screen.getAllByRole('row').length, frameworkHistory.length + 1);

    assert.dom(screen.getByRole('cell', { name: `${frameworkHistory[0].id}` })).exists();
    assert.dom(screen.getByRole('cell', { name: intl.formatDate(frameworkHistory[0].startDate) })).exists();
    assert
      .dom(screen.getByText(t('components.complementary-certifications.item.framework.history.statuses.ACTIVE')))
      .hasClass('pix-tag--success');

    assert.dom(screen.getByRole('cell', { name: `${frameworkHistory[1].id}` })).exists();
    assert.dom(screen.getByRole('cell', { name: intl.formatDate(frameworkHistory[1].startDate) })).exists();
    assert
      .dom(screen.getByText(t('components.complementary-certifications.item.framework.history.statuses.ARCHIVED')))
      .hasClass('pix-tag--secondary');
  });
});
