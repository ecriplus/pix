import { render } from '@1024pix/ember-testing-library';
import ListSummaryItems from 'pix-admin/components/combined-course-blueprints/list-summary-items';
import setupIntlRenderingTest from 'pix-admin/tests/helpers/setup-intl-rendering';
import { module, test } from 'qunit';

module('Integration | Component | CombinedCourseBlueprints::ListSummaryItems', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display combined courses summary', async function (assert) {
    // given
    const combinedCourseBlueprint = {
      id: 123,
      internalName: 'Modèle de parcours apprenant',
      createdAt: new Date('2025-12-25'),
      content: [{ type: 'module', value: 'abc-123' }],
    };

    const summaries = [combinedCourseBlueprint];

    // when
    const screen = await render(<template><ListSummaryItems @summaries={{summaries}} /></template>);

    // then
    assert.dom(screen.getByText('123')).exists();
    assert.dom(screen.getByText('Modèle de parcours apprenant')).exists();
    assert.dom(screen.getByText('25/12/2025')).exists();
    assert.dom(screen.getByText('Module', { exact: false })).exists();
    assert.dom(screen.getByText('abc-123', { exact: false })).exists();
  });
});
