import { fireEvent, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import CertificationInformationGlobalActions from 'pix-admin/components/certifications/certification/informations/global-actions';
import { assessmentResultStatus } from 'pix-admin/models/certification';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../../helpers/setup-intl-rendering';
import { waitForDialogClose } from '../../../../../helpers/wait-for';

module('Integration | Component | Certifications | Certification | Information | Global actions', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  test('should display user details page link', async function (assert) {
    // given
    const certification = store.createRecord('certification', { userId: 1 });
    const session = store.createRecord('session', {});

    // when
    const screen = await render(
      <template>
        <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
      </template>,
    );

    // then
    const userDetailsLink = screen.getByRole('link', { name: "Voir les détails de l'utilisateur" });
    assert.ok(userDetailsLink.href.endsWith(`/users/${certification.userId}`));
  });

  module('cancel button', function () {
    module('when the certification status is rejected', function () {
      test('should not display a cancel button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          status: assessmentResultStatus.REJECTED,
          isPublished: false,
        });
        const session = store.createRecord('session', {
          finalizedAt: new Date(),
        });

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert.dom(screen.queryByRole('button', { name: 'Annuler la certification' })).doesNotExist();
      });
    });

    module('when the certification is validated, not cancelled, not published and the session is finalized', function (hooks) {
      let screen;

      const modalTitle = "Confirmer l'annulation de la certification";
      const modalMessage =
        'Êtes-vous sûr·e de vouloir annuler cette certification ? Cliquez sur confirmer pour poursuivre.';

      hooks.beforeEach(async function () {
        // given
        const certification = store.createRecord('certification', {
          id: 1,
          userId: 1,
          status: assessmentResultStatus.VALIDATED,
          isPublished: false,
          save: sinon.stub(),
          reload: sinon.stub(),
        });
        const session = store.createRecord('session', {
          finalizedAt: new Date(),
        });

        // when
        screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );
      });

      test('should display a cancel button', async function (assert) {
        // then
        assert.dom(screen.getByRole('button', { name: 'Annuler la certification' })).exists();
      });

      test('on cancel button click, should display a confirmation modal', async function (assert) {
        // when
        await fireEvent.click(screen.getByRole('button', { name: 'Annuler la certification' }));

        await screen.findByRole('dialog');

        // then
        assert.dom(screen.getByText(modalTitle)).exists();
        assert.dom(screen.getByText(modalMessage)).exists();
        assert.dom(screen.getByRole('button', { name: 'Confirmer' })).exists();
        assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
      });

      module('on modal confirmation', function () {
        test('on success, should cancel the certification and close the modal', async function (assert) {
          // given
          const currentCertification = store.peekRecord('certification', 1);

          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Annuler la certification' }));
          await screen.findByRole('dialog');
          await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
          await waitForDialogClose();

          // then
          sinon.assert.calledWith(currentCertification.save, {
            adapterOptions: { isCertificationCancel: true },
          });
          assert.ok(currentCertification.reload.calledOnce);
          assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
        });

        test('on error, should display a notification and close the modal', async function (assert) {
          // given
          const notificationStub = sinon.stub();
          class NotificationsStub extends Service {
            sendErrorNotification = notificationStub;
          }
          this.owner.register('service:pixToast', NotificationsStub);

          const currentCertification = store.peekRecord('certification', 1);
          currentCertification.save.rejects();

          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Annuler la certification' }));
          await screen.findByRole('dialog');
          await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
          await waitForDialogClose();

          // then
          sinon.assert.calledWith(notificationStub, { message: 'Une erreur est survenue.' });
          assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
        });
      });

      test('on modal cancellation, should close the modal', async function (assert) {
        // given
        const currentCertification = store.peekRecord('certification', 1);

        // when
        await fireEvent.click(screen.getByRole('button', { name: 'Annuler la certification' }));

        await screen.findByRole('dialog');

        await fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

        await waitForDialogClose();

        // then
        assert.ok(currentCertification.save.notCalled);
        assert.ok(currentCertification.reload.notCalled);
        assert.dom(screen.queryByRole('button', { name: 'Annuler' })).doesNotExist();
      });
    });
  });

  module('uncancel button', function () {
    module('when the certification is cancelled, not published and the session is finalized', function (hooks) {
      let screen;

      const modalTitle = 'Confirmer la désannulation de la certification';
      const modalMessage =
        'Êtes-vous sûr·e de vouloir désannuler cette certification ? Cliquez sur confirmer pour poursuivre.';

      hooks.beforeEach(async function () {
        // given
        const certification = store.createRecord('certification', {
          id: 1,
          userId: 1,
          status: assessmentResultStatus.CANCELLED,
          isPublished: false,
          save: sinon.stub(),
          reload: sinon.stub(),
        });
        const session = store.createRecord('session', {
          finalizedAt: new Date(),
        });

        // when
        screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );
      });

      test('should display an uncancel button', async function (assert) {
        // then
        assert.dom(screen.getByRole('button', { name: 'Désannuler la certification' })).exists();
      });

      test('on cancel button click, should display a confirmation modal', async function (assert) {
        // when
        await fireEvent.click(screen.getByRole('button', { name: 'Désannuler la certification' }));

        await screen.findByRole('dialog');

        // then
        assert.dom(screen.getByText(modalTitle)).exists();
        assert.dom(screen.getByText(modalMessage)).exists();
        assert.dom(screen.getByRole('button', { name: 'Confirmer' })).exists();
        assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
      });

      module('on modal confirmation', function () {
        test('should uncancel the certification and close the modal', async function (assert) {
          // given
          const currentCertification = store.peekRecord('certification', 1);

          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Désannuler la certification' }));

          await screen.findByRole('dialog');

          await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));

          await waitForDialogClose();

          // then
          sinon.assert.calledWith(currentCertification.save, {
            adapterOptions: { isCertificationUncancel: true },
          });
          assert.ok(currentCertification.reload.calledOnce);
          assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
        });

        test('on error, should display a notification and close the modal', async function (assert) {
          // given
          const notificationStub = sinon.stub();
          class NotificationsStub extends Service {
            sendErrorNotification = notificationStub;
          }
          this.owner.register('service:pixToast', NotificationsStub);

          const currentCertification = store.peekRecord('certification', 1);
          currentCertification.save.rejects();

          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Désannuler la certification' }));
          await screen.findByRole('dialog');
          await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
          await waitForDialogClose();

          // then
          sinon.assert.calledWith(notificationStub, { message: 'Une erreur est survenue.' });
          assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
        });
      });

      test('on modal cancellation, should close the modal', async function (assert) {
        // given
        const currentCertification = store.peekRecord('certification', 1);

        // when
        await fireEvent.click(screen.getByRole('button', { name: 'Désannuler la certification' }));

        await screen.findByRole('dialog');

        await fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

        await waitForDialogClose();

        // then
        assert.ok(currentCertification.save.notCalled);
        assert.ok(currentCertification.reload.notCalled);
        assert.dom(screen.queryByRole('button', { name: 'Annuler' })).doesNotExist();
      });
    });
  });

  module('reject button', function () {
    module('when the certification status is cancelled', function () {
      test('should not display a reject button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          status: assessmentResultStatus.CANCELLED,
        });
        const session = store.createRecord('session', {});

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert.dom(screen.queryByRole('button', { name: 'Rejeter la certification' })).doesNotExist();
      });
    });

    module('when the certification is already rejected', function () {
      test('should not display a reject button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          status: assessmentResultStatus.REJECTED,
        });
        const session = store.createRecord('session', {});

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert.dom(screen.queryByRole('button', { name: 'Rejeter la certification' })).doesNotExist();
      });
    });

    module('when the certification is not rejected', function () {
      module('when the certification is not published', function (hooks) {
        let screen;

        const modalTitle = 'Confirmer le rejet de la certification';
        const modalMessage =
          'Êtes-vous sûr·e de vouloir rejeter cette certification ? Cliquez sur confirmer pour poursuivre.';

        hooks.beforeEach(async function () {
          // given
          const certification = store.createRecord('certification', {
            id: 1,
            userId: 1,
            status: assessmentResultStatus.VALIDATED,
            save: sinon.stub(),
            reload: sinon.stub(),
          });
          const session = store.createRecord('session', {});

          // when
          screen = await render(
            <template>
              <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
            </template>,
          );
        });

        test('should display a reject button', async function (assert) {
          // then
          assert.dom(screen.getByRole('button', { name: 'Rejeter la certification' })).exists();
        });

        test('on reject button click, should display a confirmation modal', async function (assert) {
          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Rejeter la certification' }));

          await screen.findByRole('dialog');

          // then
          assert.dom(screen.getByText(modalTitle)).exists();
          assert.dom(screen.getByText(modalMessage)).exists();
          assert.dom(screen.getByRole('button', { name: 'Confirmer' })).exists();
          assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
        });

        module('on modal confirmation', function () {
          test('should cancel the certification and close the modal', async function (assert) {
            // given
            const currentCertification = store.peekRecord('certification', 1);

            // when
            await fireEvent.click(screen.getByRole('button', { name: 'Rejeter la certification' }));
            await screen.findByRole('dialog');
            await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
            await waitForDialogClose();

            // then
            sinon.assert.calledWith(currentCertification.save, {
              adapterOptions: { isCertificationReject: true },
            });
            assert.ok(currentCertification.reload.calledOnce);
            assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
          });

          test('on error, should display a notification and close the modal', async function (assert) {
            // given
            const notificationStub = sinon.stub();
            class NotificationsStub extends Service {
              sendErrorNotification = notificationStub;
            }
            this.owner.register('service:pixToast', NotificationsStub);

            const currentCertification = store.peekRecord('certification', 1);
            currentCertification.save.rejects();

            // when
            await fireEvent.click(screen.getByRole('button', { name: 'Rejeter la certification' }));
            await screen.findByRole('dialog');
            await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
            await waitForDialogClose();

            // then
            sinon.assert.calledWith(notificationStub, { message: 'Une erreur est survenue.' });
            assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
          });
        });

        test('on modal cancellation, should close the modal', async function (assert) {
          // given
          const currentCertification = store.peekRecord('certification', 1);

          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Rejeter la certification' }));

          await screen.findByRole('dialog');

          await fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

          await waitForDialogClose();

          // then
          assert.ok(currentCertification.save.notCalled);
          assert.ok(currentCertification.reload.notCalled);
          assert.dom(screen.queryByRole('button', { name: 'Annuler' })).doesNotExist();
        });
      });

      module('when the certification is published', function () {
        test('should display a disabled reject button with an explaining tooltip', async function (assert) {
          // given
          const certification = store.createRecord('certification', {
            userId: 1,
            status: assessmentResultStatus.VALIDATED,
            isPublished: true,
          });
          const session = store.createRecord('session', {});

          // when
          const screen = await render(
            <template>
              <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
            </template>,
          );

          // then
          const rejectButton = screen.getByRole('button', { name: 'Rejeter la certification' });
          const tooltipText =
            'Vous ne pouvez pas rejeter une certification publiée. Merci de dépublier la session avant de rejeter cette certification.';

          assert.dom(rejectButton).hasAttribute('aria-disabled');
          await fireEvent.mouseOver(rejectButton);
          assert.dom(screen.getByText(tooltipText)).exists();
        });
      });
    });
  });

  module('unreject button', function () {
    module('when the certification is rejected for fraud', function (hooks) {
      let screen;

      const modalTitle = "Confirmer l'annulation du rejet de la certification";
      const modalMessage =
        'Êtes-vous sûr·e de vouloir annuler le rejet de cette certification ? Cliquez sur confirmer pour poursuivre.';

      hooks.beforeEach(async function () {
        // given
        const certification = store.createRecord('certification', {
          id: 1,
          userId: 1,
          status: assessmentResultStatus.REJECTED,
          isRejectedForFraud: true,
          save: sinon.stub(),
          reload: sinon.stub(),
        });
        const session = store.createRecord('session', {});

        // when
        screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );
      });

      test('should display an uncancel button', async function (assert) {
        // then
        assert.dom(screen.getByRole('button', { name: 'Annuler le rejet' })).exists();
      });

      test('on cancel button click, should display a confirmation modal', async function (assert) {
        // when
        await fireEvent.click(screen.getByRole('button', { name: 'Annuler le rejet' }));

        await screen.findByRole('dialog');

        // then
        assert.dom(screen.getByText(modalTitle)).exists();
        assert.dom(screen.getByText(modalMessage)).exists();
        assert.dom(screen.getByRole('button', { name: 'Confirmer' })).exists();
        assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
      });

      module('on modal confirmation', function () {
        test('should unreject the certification and close the modal', async function (assert) {
          // given
          const currentCertification = store.peekRecord('certification', 1);

          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Annuler le rejet' }));

          await screen.findByRole('dialog');

          await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));

          await waitForDialogClose();

          // then
          sinon.assert.calledWith(currentCertification.save, {
            adapterOptions: { isCertificationUnreject: true },
          });
          assert.ok(currentCertification.reload.calledOnce);
          assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
        });

        test('on error, should display a notification and close the modal', async function (assert) {
          // given
          const notificationStub = sinon.stub();
          class NotificationsStub extends Service {
            sendErrorNotification = notificationStub;
          }
          this.owner.register('service:pixToast', NotificationsStub);

          const currentCertification = store.peekRecord('certification', 1);
          currentCertification.save.rejects();

          // when
          await fireEvent.click(screen.getByRole('button', { name: 'Annuler le rejet' }));
          await screen.findByRole('dialog');
          await fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
          await waitForDialogClose();

          // then
          sinon.assert.calledWith(notificationStub, { message: 'Une erreur est survenue.' });
          assert.dom(screen.queryByRole('button', { name: 'Confirmer' })).doesNotExist();
        });
      });

      test('on modal cancellation, should close the modal', async function (assert) {
        // given
        const currentCertification = store.peekRecord('certification', 1);

        // when
        await fireEvent.click(screen.getByRole('button', { name: 'Annuler le rejet' }));

        await screen.findByRole('dialog');

        await fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

        await waitForDialogClose();

        // then
        assert.ok(currentCertification.save.notCalled);
        assert.ok(currentCertification.reload.notCalled);
        assert.dom(screen.queryByRole('button', { name: 'Annuler' })).doesNotExist();
      });
    });
  });

  module('rescore button', function () {
    module('when the certification status is cancelled', function () {
      test('should not display a rescoring button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          status: assessmentResultStatus.CANCELLED,
          isPublished: false,
        });
        const session = store.createRecord('session', { finalizedAt: new Date() });

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert
          .dom(screen.queryByRole('button', { name: t('components.certifications.global-actions.rescoring.button') }))
          .doesNotExist();
      });
    });

    module('when the certification status is rejected', function () {
      test('should not display a rescoring button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          status: assessmentResultStatus.REJECTED,
          isPublished: false,
        });
        const session = store.createRecord('session', { finalizedAt: new Date() });

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert
          .dom(screen.queryByRole('button', { name: t('components.certifications.global-actions.rescoring.button') }))
          .doesNotExist();
      });
    });

    module('when the certification is already published', function () {
      test('should not display a rescoring button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          isPublished: true,
        });
        const session = store.createRecord('session', {});

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert
          .dom(screen.queryByRole('button', { name: t('components.certifications.global-actions.rescoring.button') }))
          .doesNotExist();
      });
    });

    module('when the certification is not finalized', function () {
      test('should not display a rescoring button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          isPublished: false,
        });
        const session = store.createRecord('session', { finalizedAt: null });

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert
          .dom(screen.queryByRole('button', { name: t('components.certifications.global-actions.rescoring.button') }))
          .doesNotExist();
      });
    });

    module('when the certification is validated, finalized but not published yet', function () {
      test('should display a rescoring button', async function (assert) {
        // given
        const certification = store.createRecord('certification', {
          userId: 1,
          status: assessmentResultStatus.VALIDATED,
          isPublished: false,
        });
        const session = store.createRecord('session', { finalizedAt: new Date('2020-01-01') });

        // when
        const screen = await render(
          <template>
            <CertificationInformationGlobalActions @certification={{certification}} @session={{session}} />
          </template>,
        );

        // then
        assert
          .dom(screen.getByRole('button', { name: t('components.certifications.global-actions.rescoring.button') }))
          .exists();
      });
    });
  });
});
