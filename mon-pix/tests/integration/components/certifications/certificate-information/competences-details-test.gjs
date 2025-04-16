import { render, within } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import { click, tab } from '@ember/test-helpers';
import userEvent from '@testing-library/user-event';
import { t } from 'ember-intl/test-support';
import CompetencesDetails from 'mon-pix/components/certifications/certificate-information/competences-details';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Certifications | Certificate | Competences details', function (hooks) {
  setupIntlRenderingTest(hooks);

  let screen;

  hooks.beforeEach(async () => {
    // given
    const resultCompetenceTree = _getCompetenceTree();

    // when
    screen = await render(<template><CompetencesDetails @resultCompetenceTree={{resultCompetenceTree}} /></template>);
  });

  test('should display component', function (assert) {
    // then
    assert.dom(screen.getByRole('heading', { name: t('pages.certificate.details.competences.title') })).exists();
    assert.dom(screen.getByText(t('pages.certificate.details.competences.description'))).exists();
    assert.dom(screen.getByRole('link', { name: t('pages.certificate.learn-about-certification-results') })).exists();

    const tablist = screen.getByRole('tablist', { name: t('pages.certificate.details.competences.title') });
    assert.dom(tablist).exists();
    assert.strictEqual(within(tablist).getAllByRole('tab').length, 2);
    assert.strictEqual(within(tablist).getAllByRole('tab')[0].textContent.trim(), 'Domaine numéro 1');
    assert.strictEqual(within(tablist).getAllByRole('tab')[1].textContent.trim(), 'Domaine 2');

    const tabpanel = screen.getByRole('tabpanel', { name: 'Domaine numéro 1' });
    assert.dom(within(tabpanel).getByRole('heading', { name: /Domaine numéro 1/ })).exists();
    assert.strictEqual(within(tabpanel).getByRole('presentation').textContent.trim(), t('common.level'));

    const displayedCompetences = within(tabpanel).getAllByRole('listitem');
    assert.strictEqual(displayedCompetences.length, 3);
    // Competence 1
    assert.dom(within(displayedCompetences[0]).getByText('Competence 1 du domaine 1')).exists();
    assert.dom(within(displayedCompetences[0]).getByText('niveau')).exists();
    assert.dom(within(displayedCompetences[0]).getByText('3')).exists();
    // Competence 2
    assert.dom(within(displayedCompetences[1]).getByText('Competence 2 du domaine 1')).exists();
    assert.dom(within(displayedCompetences[1]).getByText('niveau')).exists();
    assert.dom(within(displayedCompetences[1]).getByText('6')).exists();
    // Competence 3
    assert.dom(within(displayedCompetences[2]).getByText('Competence 3 du domaine 1')).exists();
    assert.dom(within(displayedCompetences[2]).getByText('niveau')).exists();
    assert.dom(within(displayedCompetences[2]).getByText('1')).exists();
  });

  test('should update tabpanel on tab click', async function (assert) {
    const tablist = screen.getByRole('tablist', { name: t('pages.certificate.details.competences.title') });
    click(within(tablist).getAllByRole('tab')[1]);

    const tabpanel = await screen.findByRole('tabpanel', { name: /Domaine 2/ });
    assert.dom(within(tabpanel).getByRole('heading', { name: /Domaine 2/ })).exists();
    assert.strictEqual(within(tabpanel).getAllByRole('listitem').length, 1);
    assert.dom(within(within(tabpanel).getAllByRole('listitem')[0]).getByText('Competence 1 du domaine 2')).exists();
    assert.dom(within(within(tabpanel).getAllByRole('listitem')[0]).getByText('niveau')).exists();
    assert.dom(within(within(tabpanel).getAllByRole('listitem')[0]).getByText('4')).exists();
  });

  test('should update tabpanel on keyboard navigation', async function (assert) {
    const tablist = screen.getByRole('tablist', { name: t('pages.certificate.details.competences.title') });

    await tab();
    await tab();

    await userEvent.keyboard('[ArrowDown]');
    assert.strictEqual(document.activeElement, within(tablist).getAllByRole('tab')[1]);
    await userEvent.keyboard('[ArrowRight]');
    assert.strictEqual(document.activeElement, within(tablist).getAllByRole('tab')[0]);
    await userEvent.keyboard('[ArrowUp]');
    assert.strictEqual(document.activeElement, within(tablist).getAllByRole('tab')[1]);
    await userEvent.keyboard('[ArrowLeft]');
    assert.strictEqual(document.activeElement, within(tablist).getAllByRole('tab')[0]);
    await userEvent.keyboard('[ArrowUp]');

    await userEvent.keyboard('[Enter]');
    assert.dom(screen.getByRole('tabpanel', { name: /Domaine 2/ })).exists();
  });
});

function _getCompetenceTree() {
  return EmberObject.create({
    areas: [
      EmberObject.create({
        code: 1,
        id: 'recvoGdo7z2z7pXWa',
        name: '1. Premier domaine',
        title: 'Domaine numéro 1',
        resultCompetences: [
          EmberObject.create({
            index: '2.1',
            name: 'Competence 1 du domaine 1',
            level: 3,
          }),
          EmberObject.create({
            index: '2.2',
            name: 'Competence 2 du domaine 1',
            level: 6,
          }),
          EmberObject.create({
            index: '2.3',
            name: 'Competence 3 du domaine 1',
            level: 1,
          }),
        ],
      }),
      EmberObject.create({
        code: 2,
        id: 'recs7Gpf90ln8NCv7',
        name: '2. Deuxième domaine',
        title: 'Domaine 2',
        resultCompetences: [
          EmberObject.create({
            index: '1.1',
            name: 'Competence 1 du domaine 2',
            level: 4,
          }),
        ],
      }),
    ],
  });
}
