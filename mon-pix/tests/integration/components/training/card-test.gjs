import { render, within } from '@1024pix/ember-testing-library';
import TrainingCard from 'mon-pix/components/training/card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Training | Card', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should render the component', async function (assert) {
    // given
    const training = {
      title: 'Mon super training',
      link: 'https://training.net/',
      type: 'webinaire',
      locale: 'fr-fr',
      duration: { hours: 6 },
      editorName: "Ministère de l'éducation nationale et de la jeunesse. Liberté égalité fraternité",
      editorLogoUrl:
        'https://images.pix.fr/contenu-formatif/editeur/logo-ministere-education-nationale-et-jeunesse.svg',
    };

    // when
    const screen = await render(<template><TrainingCard @training={{training}} /></template>);

    // then
    const list = screen.getByRole('list');

    assert.dom(screen.getByRole('link', 'https://training.net/')).exists();
    assert.dom(screen.getByRole('heading', { name: 'Mon super training', level: 3 })).exists();
    assert.dom(screen.getByTitle('Webinaire - 6h')).exists();
    assert.dom(within(list).getByText('Webinaire')).exists();
    assert.dom(within(list).getByText('6h')).exists();
    assert.dom(screen.getByRole('presentation', { name: '' })).exists();
    assert
      .dom(
        screen.getByRole('img', {
          name: "Contenu formatif proposé par Ministère de l'éducation nationale et de la jeunesse. Liberté égalité fraternité",
        }),
      )
      .hasAttribute(
        'src',
        'https://images.pix.fr/contenu-formatif/editeur/logo-ministere-education-nationale-et-jeunesse.svg',
      );
  });
});
