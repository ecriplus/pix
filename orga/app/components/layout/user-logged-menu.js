import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class UserLoggedMenu extends Component {
  @service currentUser;
  @service router;
  @service store;

  get organizationNameAndExternalId() {
    const organization = this.currentUser.organization;
    if (organization.externalId) {
      return `${organization.name} (${organization.externalId})`;
    }
    return organization.name;
  }

  get eligibleOrganizations() {
    const memberships = this.currentUser.memberships;
    if (!memberships) {
      return [];
    }
    return memberships
      .slice()
      .map((membership) => ({
        label: `${membership.organization.get('name')} (${membership.organization.get('externalId')})`,
        value: membership.organization.get('id'),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  get belongsToSeveralOrganizations() {
    return this.eligibleOrganizations.length > 1;
  }

  @action
  async onOrganizationChange(organization) {
    const prescriber = this.currentUser.prescriber;
    const userOrgaSettingsId = prescriber.userOrgaSettings.get('id');

    const userOrgaSettings = await this.store.peekRecord('user-orga-setting', userOrgaSettingsId);
    const selectedOrganization = await this.store.peekRecord('organization', organization.value);

    userOrgaSettings.organization = selectedOrganization;
    await userOrgaSettings.save({ adapterOptions: { userId: prescriber.id } });

    const queryParams = {};
    Object.keys(this.router.currentRoute.queryParams).forEach((key) => (queryParams[key] = undefined));
    this.router.replaceWith('authenticated', { queryParams });

    await this.currentUser.load();
    this.args.onChangeOrganization();
  }
}
