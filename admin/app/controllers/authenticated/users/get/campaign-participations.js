import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class UserCampaignParticipationsController extends Controller {
  @service pixToast;

  @action
  async removeParticipation(campaignParticipation) {
    try {
      await campaignParticipation.deleteRecord();
      await campaignParticipation.save();
      await campaignParticipation.unloadRecord();
      await this.model.reload();
      this.send('refreshModel');
      this.pixToast.sendSuccessNotification({ message: 'La participation du prescrit a été supprimée avec succès.' });
    } catch {
      this.pixToast.sendErrorNotification({
        message: 'Une erreur est survenue lors de la suppression de la participation.',
      });
    }
  }
}
