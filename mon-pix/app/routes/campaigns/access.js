import Route from '@ember/routing/route';
import { service } from '@ember/service';
import get from 'lodash/get';

export default class AccessRoute extends Route {
  @service currentUser;
  @service session;
  @service campaignStorage;
  @service accessStorage;
  @service router;
  @service store;
  @service oidcIdentityProviders;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel(transition) {
    if (!transition.from) {
      return this.router.replaceWith('campaigns.entry-point');
    }

    this.authenticationRoute = 'inscription';
    const campaign = this.modelFor('campaigns');

    const identityProviderToVisit = this.oidcIdentityProviders.list.find((identityProvider) => {
      const isUserLoggedInToIdentityProvider =
        get(this.session, 'data.authenticated.identityProviderCode') === identityProvider.code;
      return campaign.isRestrictedByIdentityProvider(identityProvider.code) && !isUserLoggedInToIdentityProvider;
    });

    if (identityProviderToVisit) {
      this.session.setAttemptedTransition(transition);
      return this.router.replaceWith('authentication.login-oidc', identityProviderToVisit.id);
    } else if (this._shouldLoginToAccessSCORestrictedCampaign(campaign)) {
      this.authenticationRoute = 'campaigns.join.student-sco';
    } else if (this._shouldJoinFromMediacentre(campaign)) {
      this.authenticationRoute = 'campaigns.join.sco-mediacentre';
    } else if (this._shouldJoinSimplifiedCampaignAsAnonymous(campaign)) {
      this.authenticationRoute = 'campaigns.join.anonymous';
    }

    this.session.requireAuthenticationAndApprovedTermsOfService(transition, this.authenticationRoute);
  }

  model() {
    return this.modelFor('campaigns');
  }

  async afterModel(campaign) {
    const ongoingCampaignParticipation = await this.store.queryRecord('campaign-participation', {
      campaignId: campaign.id,
      userId: this.currentUser.user.id,
    });
    const hasParticipated = Boolean(ongoingCampaignParticipation);
    this.campaignStorage.set(campaign.code, 'hasParticipated', hasParticipated);

    if (hasParticipated) {
      this.router.replaceWith('campaigns.entrance', campaign.code);
    } else {
      this.router.replaceWith('campaigns.invited', campaign.code);
    }
  }

  _shouldLoginToAccessSCORestrictedCampaign(campaign) {
    const isAuthenticatedByGar = this.session.isAuthenticatedByGar;
    const hasUserSeenJoinPage = this.accessStorage.get(campaign.organizationId, 'hasUserSeenJoinPage');
    return (
      campaign.isRestricted &&
      campaign.organizationType === 'SCO' &&
      /**  Two types of reconciliation exist : one with legacy import system and one with generic import feature.
       * Here, we want to use the legacy one for SCO users. In legacy import system, there are no reconciliation fields configuration (there are always the same).
       * Backend side, we check if reconciliation fields have been configured thanks to isReconciliationRequired variable.
       * (Therefore, the name of the variable is not really accurate.)
       */
      !campaign.isReconciliationRequired &&
      !this.session.isAuthenticated &&
      (!isAuthenticatedByGar || hasUserSeenJoinPage)
    );
  }

  _shouldJoinFromMediacentre(campaign) {
    const isAuthenticatedByGar = this.session.isAuthenticatedByGar;
    return campaign.isRestricted && isAuthenticatedByGar;
  }

  _shouldJoinSimplifiedCampaignAsAnonymous(campaign) {
    return campaign.isSimplifiedAccess && !this.session.isAuthenticated;
  }
}
