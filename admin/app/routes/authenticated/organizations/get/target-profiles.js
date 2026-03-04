import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OrganizationTargetProfilesRoute extends Route {
  @service intl;
  @service pixToast;
  @service store;

  async model() {
    const organization = this.modelFor('authenticated.organizations.get');
    const targetProfileSummaries = await organization.hasMany('targetProfileSummaries').reload();

    return {
      organization,
      targetProfileSummaries,
      onAttachTargetProfiles: this.attachTargetProfiles.bind(this),
      onDetachTargetProfile: this.detachTargetProfile.bind(this),
    };
  }

  async attachTargetProfiles(targetProfileIds) {
    const { organization, targetProfileSummaries } = this.currentModel;
    const currentIds = targetProfileSummaries.map(({ id }) => id);
    const attachedIds = targetProfileIds.filter((id) => !currentIds.includes(id));
    const duplicatedIds = currentIds.filter((id) => targetProfileIds.includes(id));
    const hasInserted = attachedIds.length > 0;

    try {
      const adapter = this.store.adapterFor('organization');
      await adapter.attachTargetProfile({ organizationId: organization.id, targetProfileIds });

      if (hasInserted) {
        const successMessage =
          attachedIds.length === 1
            ? `Le profil cible ${attachedIds[0]} a été rattaché avec succès.`
            : `Les profils cibles suivants ont été rattachés avec succès : ${attachedIds.join(', ')}.`;
        this.pixToast.sendSuccessNotification({ message: successMessage });
      }
      if (duplicatedIds.length > 0) {
        const warningMessage =
          duplicatedIds.length === 1
            ? `Le profil cible ${duplicatedIds[0]} est déjà rattaché à cette organisation.`
            : `Les profils cibles suivants sont déjà rattachés à cette organisation : ${duplicatedIds.join(', ')}.`;
        this.pixToast.sendWarningNotification({ message: warningMessage });
      }
      this.refresh();
    } catch (responseError) {
      this.handleResponseError(responseError);
    }
  }

  async detachTargetProfile(targetProfileId) {
    const { organization } = this.currentModel;

    try {
      const adapter = this.store.adapterFor('target-profile');
      await adapter.detachOrganizations(targetProfileId, [organization.id]);
      this.pixToast.sendSuccessNotification({ message: `Profil cible ${targetProfileId} détaché avec succès.` });
      this.refresh();
    } catch (responseError) {
      this.handleResponseError(responseError);
    }
  }

  handleResponseError({ errors }) {
    const genericErrorMessage = this.intl.t('common.notifications.generic-error');

    if (!errors) {
      this.pixToast.sendErrorNotification({ message: genericErrorMessage });
      return;
    }
    errors.forEach((error) => {
      if (['404', '412'].includes(error.status)) {
        this.pixToast.sendErrorNotification({ message: error.detail });
      } else {
        this.pixToast.sendErrorNotification({ message: genericErrorMessage });
      }
    });
  }
}
