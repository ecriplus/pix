import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import authenticateSession from '../helpers/authenticate-session';
import { createPrescriberByUser, createUserWithMembershipAndTermsOfServiceAccepted } from '../helpers/test-init';

module('Acceptance | preselect-target-profile', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async () => {
    const user = createUserWithMembershipAndTermsOfServiceAccepted();
    createPrescriberByUser({ user });
    await authenticateSession(user.id);
  });

  test('it should display tubes', async function (assert) {
    // given
    server.create('tube', { id: 'recTube1', practicalTitle: 'Tube 1' });
    server.create('tube', { id: 'recTube2', practicalTitle: 'Tube 2' });
    server.create('tube', { id: 'recTube3', practicalTitle: 'Tube 3' });
    server.create('thematic', {
      id: 'recThematic1',
      name: 'Competence 1',
      tubeIds: ['recTube1', 'recTube2', 'recTube3'],
    });
    server.create('competence', { id: 'recCompetence1', name: 'Competence 1', thematicIds: ['recThematic1'] });
    server.create('area', { id: 'area1', title: 'Area 1', competenceIds: ['recCompetence1'] });
    server.create('framework', { id: 'framework1', name: 'Pix', areaIds: ['area1'] });

    server.create('tube', { id: 'recTube4', practicalTitle: 'Tube 4' });
    server.create('tube', { id: 'recTube5', practicalTitle: 'Tube 5' });
    server.create('thematic', {
      id: 'recThematic2',
      name: 'Competence 2',
      tubeIds: ['recTube4', 'recTube5'],
    });
    server.create('competence', { id: 'recCompetence2', name: 'Competence 2', thematicIds: ['recThematic2'] });
    server.create('area', { id: 'area2', title: 'Area 2', competenceIds: ['recCompetence2'] });
    server.create('framework', { id: 'framework2', name: 'Edu+', areaIds: ['area2'] });

    // when
    const screen = await visit('/selection-sujets');

    const area = await screen.findByText('· Area 1');

    await click(area);

    // then
    assert.ok(screen.getByRole('heading', { level: 2, name: 'Pix' }));
    assert.dom(await screen.findByLabelText('Tube 1 :')).exists();
    assert.dom(await screen.findByLabelText('Tube 2 :')).exists();
    assert.dom(await screen.findByLabelText('Tube 3 :')).exists();
    assert.ok(screen.getByRole('heading', { level: 2, name: 'Edu+' }));
  });
});
