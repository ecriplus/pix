import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class InvitationsRoute extends Route {
  @service store;
  @service router;

  beforeModel() {
    const organization = this.modelFor('authenticated.organizations.get');
    if (organization.isArchived) {
      return this.router.replaceWith('authenticated.organizations.get.details');
    }
  }

  async model() {
    const organization = this.modelFor('authenticated.organizations.get');
    return RSVP.hash({
      organization: organization,
      organizationInvitations: organization.organizationInvitations,
    });
  }
}
