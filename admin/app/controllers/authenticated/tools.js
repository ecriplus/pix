import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import { createMermaidFlowchartLink } from '../../utils/create-tree-data';

export default class ToolsController extends Controller {
  @service pixToast;
  @service store;
  @service currentUser;
  @tracked juniorMermaidFlowchart;

  @action
  async archiveCampaigns(files) {
    const adapter = this.store.adapterFor('import-files');

    this.isLoading = true;
    try {
      await adapter.importCampaignsToArchive(files);
      this.isLoading = false;
      this.pixToast.sendSuccessNotification({ message: 'Toutes les campagnes ont été archivées.' });
    } catch ({ errors: [error] }) {
      this.isLoading = false;
      if (error.code === 'HEADER_REQUIRED') {
        this.pixToast.sendErrorNotification({ message: "La colonne campaignId n'est pas présente." });
      } else if (error.code === 'HEADER_UNKNOWN') {
        this.pixToast.sendErrorNotification({ message: 'Une colonne dans le fichier ne devrait pas être présente.' });
      } else if (error.code === 'ENCODING_NOT_SUPPORTED') {
        this.pixToast.sendErrorNotification({ message: 'Encodage non supporté.' });
      } else {
        this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue. OUPS...' });
      }
    }
  }

  @action
  displayTree([file]) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => this._onFileLoad(event));
    reader.readAsText(file);
  }

  _onFileLoad(event) {
    const data = JSON.parse(event.target.result);
    this.juniorMermaidFlowchart = createMermaidFlowchartLink(data);
  }
}
