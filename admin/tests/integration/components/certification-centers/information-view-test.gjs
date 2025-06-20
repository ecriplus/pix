import { render } from '@1024pix/ember-testing-library';
import InformationView from 'pix-admin/components/certification-centers/information-view';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | certification-centers/information-view', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display label and values in read mode', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const pixDroitHabilitation = store.createRecord('complementary-certification', {
      id: 0,
      key: 'DROIT',
      label: 'Pix+Droit',
    });
    const cleaHabilitation = store.createRecord('complementary-certification', { id: 1, key: 'CLEA', label: 'Cléa' });
    const availableHabilitations = [pixDroitHabilitation, cleaHabilitation];

    const certificationCenter = store.createRecord('certification-center', {
      name: 'Centre SCO',
      type: 'SCO',
      externalId: 'AX129',
      dataProtectionOfficerFirstName: 'Lucky',
      dataProtectionOfficerLastName: 'Number',
      dataProtectionOfficerEmail: 'lucky@example.net',
      habilitations: [pixDroitHabilitation],
    });

    // when
    const screen = await render(
      <template>
        <InformationView
          @availableHabilitations={{availableHabilitations}}
          @certificationCenter={{certificationCenter}}
        />
      </template>,
    );

    // then
    assert.dom(screen.getByText('Type :')).exists();
    assert.dom(screen.getByText('Identifiant externe :')).exists();
    assert.dom(screen.getByText('Centre SCO')).exists();
    assert.dom(screen.getByText('AX129')).exists();
    assert.dom(screen.getByText('Lucky Number')).exists();
    assert.dom(screen.getByText('lucky@example.net')).exists();
    assert.strictEqual(screen.getAllByTitle('Délégué à la protection des données').length, 2);
    assert.dom(screen.getByLabelText('Habilité pour Pix+Droit')).exists();
    assert.dom(screen.getByLabelText('Non habilité pour Cléa')).exists();
  });

  test('it should show button to direct user to metabase dashboard', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const certificationCenter = store.createRecord('certification-center', {
      name: 'Centre SCO',
      type: 'SCO',
      externalId: 'AX129',
    });

    // when
    const screen = await render(<template><InformationView @certificationCenter={{certificationCenter}} /></template>);

    // then
    assert.dom(screen.getByText('Tableau de bord')).exists();
  });
});
