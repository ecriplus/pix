import { render } from '@1024pix/ember-testing-library';
import LeaveOrganizationModal from 'pix-orga/components/team/leave-organization-modal';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Components | Team::LeaveOrganizationModal', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('displays modal content', async function (assert) {
    // given
    const currentUserOrganizationName = 'Cola Corp';
    const isLeaveOrganizationModalDisplayed = true;
    const noop = sinon.stub();

    // when
    const screen = await render(
      <template>
        <LeaveOrganizationModal
          @organizationName={{currentUserOrganizationName}}
          @isOpen={{isLeaveOrganizationModalDisplayed}}
          @onSubmit={{noop}}
          @onClose={{noop}}
        />
      </template>,
    );

    // then
    const modalTitleElement = screen.getByRole('heading', { level: 1, name: 'Quitter cet espace Pix Orga' });
    assert.dom(modalTitleElement).exists();

    const modalContentElement = screen.getByText('Cola Corp');
    assert.dom(modalContentElement).exists();

    const cancelButtonElement = screen.getByRole('button', { name: 'Annuler' });
    assert.dom(cancelButtonElement).exists();

    const confirmButtonElement = screen.getByRole('button', { name: 'Confirmer' });
    assert.dom(confirmButtonElement).exists();
  });
});
