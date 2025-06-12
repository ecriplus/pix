import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class StudentScoController extends Controller {
  @service router;
  @service accessStorage;
  @service session;

  @action
  async reconcile(scoOrganizationLearner, adapterOptions) {
    const mustNotRedirectAfterSave = adapterOptions.withReconciliation === false;
    await scoOrganizationLearner.save({ adapterOptions });

    if (mustNotRedirectAfterSave) {
      return;
    }

    this.accessStorage.setAssociationDone(this.model.organizationId);
    this.router.transitionTo('campaigns.invited.fill-in-participant-external-id', this.model.code);
    return;
  }

  @action
  async goToConnectionPage() {
    this.session.set('skipRedirectAfterSessionInvalidation', true);
    await this.session.invalidate();
    this.accessStorage.setHasUserSeenJoinPage(this.model.organizationId);
    this.router.replaceWith('campaigns.access', this.model.code);
  }
}
