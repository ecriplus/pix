import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { triggerEvent } from '@ember/test-helpers';
import ToolsCampaigns from 'pix-admin/components/tools/campaigns';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | tools/campaigns', function (hooks) {
  setupIntlRenderingTest(hooks);

  let importFilesStub;

  hooks.beforeEach(function () {
    const store = this.owner.lookup('service:store');
    const adapter = store.adapterFor('import-files');
    importFilesStub = sinon.stub(adapter, 'importCampaignsToArchive');

    class PixToastStub extends Service {
      sendSuccessNotification = sinon.stub();
      sendErrorNotification = sinon.stub();
    }
    this.owner.register('service:pix-toast', PixToastStub);
  });

  test('should display the upload form with instructions', async function (assert) {
    // when
    const screen = await render(<template><ToolsCampaigns /></template>);

    // then
    assert.dom(screen.getByText('Archiver des campagnes en masse')).exists();
    assert.dom(screen.getByText('Envoyer le fichier des campagnes à archiver')).exists();
    assert.dom(screen.getByText(/L'envoi du fichier .csv via le bouton/)).exists();
    assert.dom(screen.getByText(/campaignId/)).exists();
  });

  module('#archiveCampaigns', function () {
    test('should send file to API and show success notification', async function (assert) {
      // given
      const files = [new File(['campaignId\n123\n456'], 'campaigns.csv', { type: 'text/csv' })];
      importFilesStub.resolves();

      // when
      const screen = await render(<template><ToolsCampaigns /></template>);
      const fileInput = screen.getByLabelText('Envoyer le fichier des campagnes à archiver');

      Object.defineProperty(fileInput, 'files', {
        value: files,
        writable: false,
      });

      await triggerEvent(fileInput, 'change');

      // then
      assert.ok(importFilesStub.calledWith(files));
      const pixToast = this.owner.lookup('service:pix-toast');
      assert.ok(
        pixToast.sendSuccessNotification.calledWith({
          message: 'Toutes les campagnes ont été archivées.',
        }),
      );
    });

    test('should show error notification when HEADER_REQUIRED error occurs', async function (assert) {
      // given
      const files = [new File(['id\n123'], 'campaigns.csv', { type: 'text/csv' })];
      importFilesStub.rejects({ errors: [{ status: '401', code: 'HEADER_REQUIRED' }] });

      // when
      const screen = await render(<template><ToolsCampaigns /></template>);
      const fileInput = screen.getByLabelText('Envoyer le fichier des campagnes à archiver');

      Object.defineProperty(fileInput, 'files', {
        value: files,
        writable: false,
      });

      await triggerEvent(fileInput, 'change');

      // then
      const pixToast = this.owner.lookup('service:pix-toast');
      assert.ok(
        pixToast.sendErrorNotification.calledWith({
          message: "La colonne campaignId n'est pas présente.",
        }),
      );
    });

    test('should show error notification when HEADER_UNKNOWN error occurs', async function (assert) {
      // given
      const files = [new File(['campaignId,extra\n123,value'], 'campaigns.csv', { type: 'text/csv' })];
      importFilesStub.rejects({ errors: [{ status: '401', code: 'HEADER_UNKNOWN' }] });

      // when
      const screen = await render(<template><ToolsCampaigns /></template>);
      const fileInput = screen.getByLabelText('Envoyer le fichier des campagnes à archiver');

      Object.defineProperty(fileInput, 'files', {
        value: files,
        writable: false,
      });

      await triggerEvent(fileInput, 'change');

      // then
      const pixToast = this.owner.lookup('service:pix-toast');
      assert.ok(
        pixToast.sendErrorNotification.calledWith({
          message: 'Une colonne dans le fichier ne devrait pas être présente.',
        }),
      );
    });

    test('should show error notification when ENCODING_NOT_SUPPORTED error occurs', async function (assert) {
      // given
      const files = [new File(['campaignId\n123'], 'campaigns.csv', { type: 'text/csv' })];
      importFilesStub.rejects({ errors: [{ status: '401', code: 'ENCODING_NOT_SUPPORTED' }] });

      // when
      const screen = await render(<template><ToolsCampaigns /></template>);
      const fileInput = screen.getByLabelText('Envoyer le fichier des campagnes à archiver');

      Object.defineProperty(fileInput, 'files', {
        value: files,
        writable: false,
      });

      await triggerEvent(fileInput, 'change');

      // then
      const pixToast = this.owner.lookup('service:pix-toast');
      assert.ok(pixToast.sendErrorNotification.calledWith({ message: 'Encodage non supporté.' }));
    });

    test('should show generic error notification for unknown errors', async function (assert) {
      // given
      const files = [new File(['campaignId\n123'], 'campaigns.csv', { type: 'text/csv' })];
      importFilesStub.rejects({ errors: [{ status: '500', code: 'OTHER_ERROR' }] });

      // when
      const screen = await render(<template><ToolsCampaigns /></template>);
      const fileInput = screen.getByLabelText('Envoyer le fichier des campagnes à archiver');

      Object.defineProperty(fileInput, 'files', {
        value: files,
        writable: false,
      });

      await triggerEvent(fileInput, 'change');

      // then
      const pixToast = this.owner.lookup('service:pix-toast');
      assert.ok(
        pixToast.sendErrorNotification.calledWith({
          message: 'Une erreur est survenue. OUPS...',
        }),
      );
    });
  });
});
