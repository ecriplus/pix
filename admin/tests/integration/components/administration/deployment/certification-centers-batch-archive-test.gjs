import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { triggerEvent } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import CertificationCentersBatchArchive from 'pix-admin/components/administration/deployment/certification-centers-batch-archive';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | administration/certification-centers-batch-archive', function (hooks) {
  setupIntlRenderingTest(hooks);
  setupMirage(hooks);

  let store, adapter, notificationSuccessStub, saveAdapterStub, notificationErrorStub;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
    adapter = store.adapterFor('certification-centers-batch-archive');
    saveAdapterStub = sinon.stub(adapter, 'archiveCertificationCenters');
    notificationSuccessStub = sinon.stub();
    notificationErrorStub = sinon.stub().returns();
  });

  module('when batch archive succeeds', function () {
    test('it displays a success notification', async function (assert) {
      // given
      const file = new Blob(['foo'], { type: `valid-file` });
      class NotificationsStub extends Service {
        sendSuccessNotification = notificationSuccessStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);
      saveAdapterStub.withArgs(file).resolves();

      // when
      const screen = await render(<template><CertificationCentersBatchArchive /></template>);
      const input = await screen.findByLabelText(
        t('components.administration.certification-centers-batch-archive.upload-button'),
      );
      await triggerEvent(input, 'change', { files: [file] });

      // then
      assert.true(
        notificationSuccessStub.calledWith({
          message: t('components.administration.certification-centers-batch-archive.notifications.success'),
        }),
      );
    });
  });

  module('when batch archiving of certification center fails', function () {
    test.only('it displays an error notification', async function (assert) {
      // given
      this.server.post(
        '/admin/certification-centers/batch-archive',
        () =>
          new Response(
            422,
            {},
            {
              errors: [
                {
                  status: '422',
                  title: "Un souci avec l'archivage des centres de certification",
                  code: 'ARCHIVE_CERTIFICATION_CENTERS_IN_BATCH_ERROR',
                  detail: `Erreur lors de l'archivage`,
                  meta: {
                    currentLine: 2,
                    totalLines: 4,
                  },
                },
              ],
            },
          ),
        412,
      );
      const file = new Blob(['foo'], { type: `valid-file` });
      class NotificationsStub extends Service {
        sendErrorNotification = notificationErrorStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      // when
      const screen = await render(<template><CertificationCentersBatchArchive /></template>);
      const input = await screen.findByLabelText(
        t('components.administration.certification-centers-batch-archive.upload-button'),
      );
      await triggerEvent(input, 'change', { files: [file] });

      // then
      assert.ok(notificationErrorStub.called);
      assert.true(
        notificationSuccessStub.calledWith({
          message: t(
            'components.administration.certification-centers-batch-archive.notifications.errors.error-in-batch',
            {
              currentLine: 2,
              totalLines: 4,
            },
          ),
        }),
      );
    });
  });
});
