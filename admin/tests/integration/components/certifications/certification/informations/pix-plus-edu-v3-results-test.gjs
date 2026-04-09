import { clickByName, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { triggerEvent } from '@ember/test-helpers';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import PixPlusEduV3Results from 'pix-admin/components/certifications/certification/informations/pix-plus-edu-v3-results';
import { module, test } from 'qunit';
import sinon from 'sinon';

module(
  'Integration | Component | Certifications | Certification | Information | PixPlusEduV3Results',
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks, 'fr');

    let store;

    hooks.beforeEach(function () {
      store = this.owner.lookup('service:store');
    });

    module('when external jury result is pending', function () {
      test('should display waiting status for external jury', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.0',
        });

        // when
        const screen = await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        // then
        assert.dom(screen.getByRole('heading', { name: t('components.certifications.edu-results.v3.title') })).exists();

        assert.dom(screen.getByText(t('components.certifications.edu-results.v3.internal-jury'))).exists();
        assert.dom(screen.getByText(t('components.certifications.edu-results.v3.admissible'))).exists();

        assert.dom(screen.getByText(t('components.certifications.edu-results.v3.external-jury'))).exists();
        assert.dom(screen.getByText(t('components.certifications.edu-results.v3.waiting'))).exists();
      });
    });

    module('when external jury result is set', function () {
      test('should display the reached level for external jury', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.ADVANCED',
        });

        // when
        const screen = await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        // then
        assert
          .dom(screen.getByText(t('common.certification.meshLevels.PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.ADVANCED')))
          .exists();
      });
    });

    module('when certification is not published', function () {
      test('should disable the edit button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.0',
          isPublished: false,
        });

        // when
        const screen = await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        // then
        assert.dom(screen.getByRole('button', { name: 'Modifier le volet jury' })).isDisabled();
      });
    });

    module('jury level edition', function (hooks) {
      let successNotificationStub, errorNotificationStub;

      hooks.beforeEach(function () {
        successNotificationStub = sinon.stub();
        errorNotificationStub = sinon.stub();

        class PixToastStub extends Service {
          sendSuccessNotification = successNotificationStub;
          sendErrorNotification = errorNotificationStub;
        }

        this.owner.register('service:pixToast', PixToastStub);
      });

      test('should display jury select form when edit button is clicked', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.0',
          isPublished: true,
        });

        const screen = await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        // when
        await clickByName('Modifier le volet jury');

        // then
        assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
        assert.dom(screen.getByRole('button', { name: 'Enregistrer' })).exists();
      });

      test('should hide jury select form when cancel button is clicked', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.0',
          isPublished: true,
        });

        const screen = await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        await clickByName('Modifier le volet jury');

        // when
        const form = screen.getByRole('button', { name: 'Annuler' }).closest('form');
        await triggerEvent(form, 'reset');

        // then
        assert.dom(screen.queryByRole('button', { name: 'Annuler' })).doesNotExist();
        assert.dom(screen.queryByRole('button', { name: 'Enregistrer' })).doesNotExist();
      });

      test('should save and display success notification when form is submitted', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          id: '1',
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.0',
          isPublished: true,
        });

        const currentCertification = store.peekRecord('certification', 1);
        currentCertification.save = sinon.stub().resolves();

        await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        await clickByName('Modifier le volet jury');

        // when
        await clickByName('Enregistrer');

        // then
        sinon.assert.calledWith(currentCertification.save, {
          adapterOptions: {
            updateEduExternalJuryResult: true,
            eduV3ExternalJuryResult: '0',
          },
        });
        sinon.assert.calledWith(successNotificationStub, {
          message: t('components.certifications.edu-results.v3.success'),
        });
        assert.ok(true);
      });

      test('should display API error detail when save fails with error detail', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          id: '2',
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.0',
          isPublished: true,
        });

        const currentCertification = store.peekRecord('certification', 2);
        const apiError = { errors: [{ detail: 'Le niveau de jury est invalide.' }] };
        currentCertification.save = sinon.stub().rejects(apiError);

        await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        await clickByName('Modifier le volet jury');

        // when
        await clickByName('Enregistrer');

        // then
        sinon.assert.calledWith(errorNotificationStub, {
          message: 'Le niveau de jury est invalide.',
        });
        assert.ok(true);
      });

      test('should display default error notification when save fails without error detail', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          id: '3',
          reachedResultKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE.0',
          isPublished: true,
        });

        const currentCertification = store.peekRecord('certification', 3);
        currentCertification.save = sinon.stub().rejects(new Error('Network error'));

        await render(<template><PixPlusEduV3Results @certification={{certification}} /></template>);

        await clickByName('Modifier le volet jury');

        // when
        await clickByName('Enregistrer');

        // then
        sinon.assert.calledWith(errorNotificationStub, {
          message: t('components.certifications.edu-results.v3.error'),
        });
        assert.ok(true);
      });
    });
  },
);
