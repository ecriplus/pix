import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ListSummaryItems from 'pix-admin/components/combined-course-blueprints/list-summary-items';
import setupIntlRenderingTest from 'pix-admin/tests/helpers/setup-intl-rendering';
import { module, test } from 'qunit';

module('Integration | Component | CombinedCourseBlueprints::ListSummaryItems', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.owner.lookup('service:current-user');
    currentUser.adminMember = { userId: 456 };
  });

  test('it should display combined courses summary', async function (assert) {
    // given
    const combinedCourseBlueprint = {
      id: 123,
      internalName: 'Modèle de parcours apprenant',
      createdAt: new Date('2025-12-25'),
      name: 'Parcours apprenant',
      description: 'Mon super parcours apprenant',
      illustration: 'http://pix.fr/mon-illu.png',
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
    assert.ok(screen.getByRole('link', { name: t('components.combined-course-blueprints.list.downloadButton') }));
  });

  test('it should download a csv ready to import for combined course creation', async function (assert) {
    // given
    const combinedCourseBlueprint = {
      id: 123,
      internalName: 'Modèle de parcours apprenant',
      createdAt: new Date('2025-12-25'),
      name: 'Parcours apprenant',
      description: 'Mon super parcours apprenant',
      illustration: 'http://pix.fr/mon-illu.png',
      content: [{ type: 'module', value: 'abc-123' }],
    };

    const summaries = [combinedCourseBlueprint];

    // when
    const screen = await render(<template><ListSummaryItems @summaries={{summaries}} /></template>);

    const expectedHref = getHref(combinedCourseBlueprint, 456);
    const link = screen.getByRole('link', {
      name: t('components.combined-course-blueprints.list.downloadButton'),
    }).href;

    assert.strictEqual(link, expectedHref);
  });
});

function getHref(blueprint, creatorId) {
  const jsonParsed = JSON.stringify({
    name: blueprint.name,
    description: blueprint.description,
    illustration: blueprint.illustration,
  });

  const exportedData = [
    [
      'Identifiant des organisations*',
      'Identifiant du createur des campagnes*',
      'Json configuration for quest*',
      'Identifiant du schéma de parcours*',
    ],
    ['', creatorId.toString(), jsonParsed, blueprint.id.toString()],
  ];

  const csvContent = exportedData
    .map((line) => line.map((data) => `"${data.replaceAll('"', '""').replaceAll('\\""', '\\"')}"`).join(';'))
    .join('\n');

  return 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
}
