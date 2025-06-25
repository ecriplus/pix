import Model, { attr } from '@ember-data/model';

export default class OrganizationToJoin extends Model {
  @attr('string') name;
  @attr('string') type;
  @attr('string') logoUrl;
  @attr('string') identityProvider;
  @attr('boolean') isRestricted;
  @attr('boolean') isReconciliationRequired;
  @attr('boolean') hasReconciliationFields;
  @attr() reconciliationFields;

  isRestrictedByIdentityProvider(identityProviderCode) {
    return this.identityProvider === identityProviderCode;
  }
}
