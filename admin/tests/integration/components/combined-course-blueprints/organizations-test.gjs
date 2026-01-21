import { render, within } from '@1024pix/ember-testing-library';
import Organizations from 'pix-admin/components/combined-course-blueprints/organizations';
import setupIntlRenderingTest from 'pix-admin/tests/helpers/setup-intl-rendering';
import { module, test } from 'qunit';

module('Integration | Component | CombinedCourseBlueprints::Organizations', function (hooks) {
  setupIntlRenderingTest(hooks);
  let currentUser;

  hooks.beforeEach(function () {
    currentUser = this.owner.lookup('service:current-user');
  });

  module('show detach column', function () {
    test('it should display detach column when user is super admin or metier', async function (assert) {
      currentUser.adminMember = { userId: 456, isSuperAdmin: true };
      const organizations = [
        { id: 123, name: 'orga', type: 'SCO', administrationTeamName: 'Team Rocket', externalId: 345 },
      ];
      const administrationTeams = [];
      const screen = await render(
        <template>
          <Organizations @organizations={{organizations}} @administrationTeams={{administrationTeams}} />
        </template>,
      );

      assert.ok(screen.getByRole('columnheader', { name: 'Actions' }));
      assert.ok(screen.getByRole('button', { name: 'Détacher' }));
    });

    test('it should hide detach column when user is not super admin or metier', async function (assert) {
      currentUser.adminMember = { userId: 456, isSuperAdmin: false };
      const organizations = [
        { id: 123, name: 'orga', type: 'SCO', administrationTeamName: 'Team Rocket', externalId: 345 },
      ];
      const administrationTeams = [];

      const screen = await render(
        <template>
          <Organizations @organizations={{organizations}} @administrationTeams={{administrationTeams}} />
        </template>,
      );

      assert.notOk(screen.queryByRole('columnheader', { name: 'Actions' }));
      assert.notOk(screen.queryByRole('button', { name: 'Détacher' }));
    });
  });
  module('filter values', function () {
    test('it should populate filters', async function (assert) {
      currentUser.adminMember = { userId: 456, isSuperAdmin: true };
      const organizations = [
        { id: 123, name: 'orga', type: 'SUP', administrationTeamName: 'Team Rocket', externalId: 345 },
      ];
      const administrationTeams = [{ id: 456, name: 'Team Rocket' }];
      const screen = await render(
        <template>
          <Organizations
            @organizations={{organizations}}
            @administrationTeams={{administrationTeams}}
            @id={{123}}
            @name="orga"
            @type="SCO"
            @externalId="abc"
            @hideArchived={{true}}
            @administrationTeamId={{456}}
          />
        </template>,
      );

      assert.ok(screen.getByDisplayValue(123));
      assert.ok(screen.getByDisplayValue('orga'));
      assert.ok(within(screen.getByLabelText('Type')).getByText('SCO'));
      assert.ok(within(screen.getByLabelText('Équipe')).getByText('Team Rocket'));
      assert.ok(screen.getByDisplayValue('abc'));

      const archivedSegmentedControls = screen.getByRole('radiogroup', {
        name: 'Masquer les organisations archivées',
      });
      assert.dom(within(archivedSegmentedControls).getByRole('radio', { name: 'Oui' })).isChecked();
    });
  });
});
