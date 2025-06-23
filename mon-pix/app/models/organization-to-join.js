import Model, { attr } from '@ember-data/model';

export default class OrganizationToJoin extends Model {
  @attr('string') name;
  @attr('string') type;
  @attr('string') logoUrl;
  @attr('string') identityProvider;
  @attr('boolean') isRestricted;
  @attr() reconciliationFields;

  isRestrictedByIdentityProvider(identityProviderCode) {
    return this.identityProvider === identityProviderCode;
  }

  get isReconciliationRequired() {
    return this.isRestricted && this.hasReconciliationFields;
  }

  get hasReconciliationFields() {
    return Array.isArray(this.reconciliationFields) && this.reconciliationFields.length > 0;
  }
}
