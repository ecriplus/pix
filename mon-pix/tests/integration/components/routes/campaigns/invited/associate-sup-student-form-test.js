import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubSessionService } from '../../../../../helpers/service-stubs.js';
import setupIntlRenderingTest from '../../../../../helpers/setup-intl-rendering';

module('Integration | Component | routes/organizations/invited/associate-sup-student-form', function (hooks) {
  setupIntlRenderingTest(hooks);

  const organizationId = 1;
  let storeStub;
  let saveStub;
  let routerObserver;
  let setAssociationDoneStub;

  hooks.beforeEach(function () {
    stubSessionService(this.owner, { isAuthenticated: false });
    routerObserver = this.owner.lookup('service:router');
    routerObserver.transitionTo = sinon.stub();
    saveStub = sinon.stub();
    setAssociationDoneStub = sinon.stub();

    storeStub = class StoreStub extends Service {
      createRecord = () => ({
        save: saveStub,
        unloadRecord: () => sinon.stub(),
      });
    };

    class AccessStorageStub extends Service {
      setAssociationDone = setAssociationDoneStub;
    }

    this.owner.register('service:store', storeStub);
    this.owner.register('service:access-storage', AccessStorageStub);
  });

  module('when user fill the form correctly', function () {
    test('should save form', async function (assert) {
      // given
      this.set('organizationId', organizationId);
      const screen = await render(
        hbs`<Routes::Organizations::Invited::AssociateSupStudentForm
  @campaignCode={{123}}
  @organizationId={{this.organizationId}}
/>`,
      );

      // when
      await _fillInputsAndValidate({ screen });

      // then
      sinon.assert.calledWithExactly(saveStub);
      sinon.assert.calledWithExactly(setAssociationDoneStub, organizationId);
      assert.ok(true);
    });

    test('should transition to fill-in-participant-external-id', async function (assert) {
      // given
      this.set('organizationId', organizationId);
      const screen = await render(
        hbs`<Routes::Organizations::Invited::AssociateSupStudentForm
  @campaignCode={{123}}
  @organizationId={{this.organizationId}}
/>`,
      );

      // when
      await _fillInputsAndValidate({ screen });

      // then
      sinon.assert.calledWithExactly(routerObserver.transitionTo, 'campaigns.fill-in-participant-external-id', 123);
      assert.ok(true);
    });
  });

  module('when the server responds an error', function () {
    test('should display server error', async function (assert) {
      // given
      saveStub.rejects();
      this.set('organizationId', organizationId);
      const screen = await render(
        hbs`<Routes::Organizations::Invited::AssociateSupStudentForm
  @campaignCode={{123}}
  @organizationId={{this.organizationId}}
/>`,
      );

      // when
      await _fillInputsAndValidate({ screen });

      // then
      assert.ok(
        screen.getByText(
          'Veuillez vérifier les informations saisies, ou si vous avez déjà un compte Pix, connectez-vous avec celui-ci.',
        ),
      );
    });
  });

  async function _fillInputsAndValidate({ screen }) {
    await fillIn(screen.getByRole('textbox', { name: 'Numéro étudiant' }), 'F100');
    await fillIn(screen.getByRole('textbox', { name: 'Prénom' }), 'Jean');
    await fillIn(screen.getByRole('textbox', { name: 'Nom' }), 'Bon');
    await fillIn(screen.getByRole('textbox', { name: 'jour de naissance' }), '01');
    await fillIn(screen.getByRole('textbox', { name: 'mois de naissance' }), '01');
    await fillIn(screen.getByRole('textbox', { name: 'année de naissance' }), '2000');
    await click(screen.getByRole('button', { name: "C'est parti !" }));
  }
});
