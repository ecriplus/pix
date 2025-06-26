import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import ViewAutonomousCourse from 'pix-admin/components/autonomous-courses/view-autonomous-course';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Autonomous Courses | ViewAutonomousCourse', function (hooks) {
  setupIntlRenderingTest(hooks);

  const autonomousCourse = {
    id: '1',
    internalTitle: 'Titre interne',
    publicTitle: 'Titre public',
    targetProfileId: 'targetProfileId',
    customLandingPageText: "Texte de page d'accueil personnalisé",
    createdAt: '2023-12-27T15:07:57.376Z',
    code: '123456',
  };

  test('it should display autonomous course details', async function (assert) {
    // when
    const screen = await render(<template><ViewAutonomousCourse @autonomousCourse={{autonomousCourse}} /></template>);

    // then
    assert.dom(screen.getByText('Date de création :')).exists();
    assert.dom(screen.getByText('27/12/2023')).exists();
    assert.dom(screen.getByText('Nom interne :')).exists();
    assert.dom(screen.getByText('Titre interne')).exists();
    assert.dom(screen.getByText('Nom public :')).exists();
    assert.dom(screen.getByText('Titre public')).exists();
    assert.dom(screen.getByText("Texte de la page d'accueil :")).exists();
    assert.dom(screen.getByText("Texte de page d'accueil personnalisé")).exists();
  });

  test('it should display campaign link with correct URL', async function (assert) {
    // given
    Object.defineProperty(window, 'origin', {
      writable: true,
      value: 'https://admin-recette.pix.fr',
    });

    // when
    const screen = await render(<template><ViewAutonomousCourse @autonomousCourse={{autonomousCourse}} /></template>);

    // then
    const expectedLink = 'https://app-recette.pix.fr/campagnes/123456';
    assert
      .dom(screen.getByRole('link', { name: 'Lien vers la campagne 123456 (nouvelle fenêtre)' }))
      .hasAttribute('href', expectedLink);
    assert.dom(screen.getByText(expectedLink)).exists();
  });

  test('it should display copy button with tooltip', async function (assert) {
    // when
    const screen = await render(<template><ViewAutonomousCourse @autonomousCourse={{autonomousCourse}} /></template>);

    // then
    assert.dom(screen.getByRole('button', { name: 'Copier le lien de la campagne' })).exists();
  });

  test('it should copy campaign link to clipboard when copy button is clicked', async function (assert) {
    // given
    Object.defineProperty(window, 'origin', {
      writable: true,
      value: 'https://admin-recette.pix.fr',
    });
    const writeTextStub = sinon.stub().resolves();
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: writeTextStub },
    });

    // when
    const screen = await render(<template><ViewAutonomousCourse @autonomousCourse={{autonomousCourse}} /></template>);
    await click(screen.getByRole('button', { name: 'Copier le lien de la campagne' }));

    // then
    assert.ok(writeTextStub.calledOnce);
    assert.ok(writeTextStub.calledWithExactly('https://app-recette.pix.fr/campagnes/123456'));
  });

  test('it should update tooltip text after copying link', async function (assert) {
    // given
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: sinon.stub().resolves() },
    });

    // when
    const screen = await render(<template><ViewAutonomousCourse @autonomousCourse={{autonomousCourse}} /></template>);

    // then - initial state
    assert.dom(screen.getByRole('button', { name: 'Copier le lien de la campagne' })).exists();

    // when - click copy button
    await click(screen.getByRole('button', { name: 'Copier le lien de la campagne' }));

    // then - tooltip should update
    assert.dom(screen.getByRole('button', { name: 'Lien copié !' })).exists();
  });

  test('it should open campaign link in new tab', async function (assert) {
    // when
    const screen = await render(<template><ViewAutonomousCourse @autonomousCourse={{autonomousCourse}} /></template>);

    // then
    const link = screen.getByRole('link', { name: 'Lien vers la campagne 123456 (nouvelle fenêtre)' });
    assert.dom(link).hasAttribute('target', '_blank');
    assert.dom(link).hasAttribute('rel', 'noopener noreferrer');
  });
});
