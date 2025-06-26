import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InvitedRoute extends Route {
  @service accessStorage;
  @service session;
  @service router;
  @service store;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel(transition) {
    if (!transition.from) {
      return this.router.replaceWith('campaigns.entry-point');
    }

    this.session.requireAuthenticationAndApprovedTermsOfService(transition);
  }

  model() {
    return this.modelFor('organizations');
  }

  afterModel({ campaign, organizationToJoin }) {
    const associationDone = this.accessStorage.isAssociationDone(organizationToJoin.id);

    if (this.shouldAssociateInformation(organizationToJoin, associationDone)) {
      this.router.replaceWith('organizations.invited.reconciliation', campaign.code);
    } else if (this.shouldAssociateWithScoInformation(organizationToJoin, associationDone)) {
      this.router.replaceWith('organizations.invited.student-sco', campaign.code);
    } else if (this.shouldAssociateWithSupInformation(organizationToJoin, associationDone)) {
      this.router.replaceWith('organizations.invited.student-sup', campaign.code);
    } else {
      this.router.replaceWith('campaigns.fill-in-participant-external-id', campaign.code);
    }
  }

  shouldAssociateInformation(organizationToJoin, associationDone) {
    return !associationDone && organizationToJoin.isReconciliationRequired;
  }

  shouldAssociateWithScoInformation(organizationToJoin, associationDone) {
    return organizationToJoin.type === 'SCO' && organizationToJoin.isRestricted && !associationDone;
  }

  shouldAssociateWithSupInformation(organizationToJoin, associationDone) {
    return organizationToJoin.type === 'SUP' && organizationToJoin.isRestricted && !associationDone;
  }
}
