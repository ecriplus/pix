import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | prescriber', function (hooks) {
  setupTest(hooks);

  module('#hasCurrentOrganizationWithGARAsIdentityProvider', function () {
    test('it should return false if the current organization has not GAR as identity provider', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', { name: 'Willow school' });
      const userOrgaSettings = store.createRecord('user-orga-setting', { organization });
      const membership = store.createRecord('membership', { organizationRole: 'MEMBER', organization });
      const memberships = [membership];
      const model = store.createRecord('prescriber', { memberships, userOrgaSettings });

      // when / then
      assert.false(model.hasCurrentOrganizationWithGARAsIdentityProvider);
    });

    test('it should return true if the current organization has GAR as identity provider', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', {
        name: 'Willow school',
        identityProviderForCampaigns: 'GAR',
      });
      const userOrgaSettings = store.createRecord('user-orga-setting', { organization });
      const membership = store.createRecord('membership', { organizationRole: 'MEMBER', organization });
      const memberships = [membership];
      const model = store.createRecord('prescriber', { memberships, userOrgaSettings });

      // when / then
      assert.true(model.hasCurrentOrganizationWithGARAsIdentityProvider);
    });
  });

  module('#isAdminOfTheCurrentOrganization', function () {
    test('it should return true if prescriber is ADMIN of the current organization', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', { name: 'Willow school' });
      const userOrgaSettings = store.createRecord('user-orga-setting', { organization });
      const membership = store.createRecord('membership', { organizationRole: 'ADMIN', organization });
      const memberships = [membership];
      const model = store.createRecord('prescriber', { memberships, userOrgaSettings });

      // when / then
      assert.true(model.isAdminOfTheCurrentOrganization);
    });

    test('it should return false if prescriber is MEMBER of the current organization', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', { name: 'Willow school' });
      const userOrgaSettings = store.createRecord('user-orga-setting', { organization });
      const membership = store.createRecord('membership', { organizationRole: 'MEMBER', organization });
      const memberships = [membership];
      const model = store.createRecord('prescriber', { memberships, userOrgaSettings });

      // when / then
      assert.false(model.isAdminOfTheCurrentOrganization);
    });

    test('it should return false if prescriber is MEMBER of the current organization and ADMIN in another', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const currentOrganization = store.createRecord('organization', { id: '7', name: 'Willow school' });
      const otherOrganization = store.createRecord('organization', { id: '123', name: 'Tanglewood school' });
      const userOrgaSettings = store.createRecord('user-orga-setting', { organization: currentOrganization });
      const membership = store.createRecord('membership', { organizationRole: 'MEMBER', currentOrganization });
      const membership2 = store.createRecord('membership', { organizationRole: 'ADMIN', otherOrganization });
      const memberships = [membership, membership2];
      const model = store.createRecord('prescriber', { memberships, userOrgaSettings });

      // when / then
      assert.false(model.isAdminOfTheCurrentOrganization);
    });
  });

  module('#enableMultipleSendingAssessment', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['MULTIPLE_SENDING_ASSESSMENT']: { active: true, params: null } },
      });
      // when
      const enableMultipleSendingAssessment = model.enableMultipleSendingAssessment;

      // then
      assert.true(enableMultipleSendingAssessment);
    });

    test('it returns false when feature is disabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['MULTIPLE_SENDING_ASSESSMENT']: { active: false, params: null } },
      });
      // when
      const enableMultipleSendingAssessment = model.enableMultipleSendingAssessment;

      // then
      assert.false(enableMultipleSendingAssessment);
    });
  });

  module('#enableCampaignWithoutUserProfile', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given && when
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['CAMPAIGN_WITHOUT_USER_PROFILE']: { active: true, params: null } },
      });

      // then
      assert.true(model.enableCampaignWithoutUserProfile);
    });

    test('it returns false when feature is disabled', function (assert) {
      // given && when
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['CAMPAIGN_WITHOUT_USER_PROFILE']: { active: false, params: null } },
      });

      // then
      assert.false(model.enableCampaignWithoutUserProfile);
    });
  });

  module('#computeOrganizationLearnerCertificability', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY']: { active: true, params: null } },
      });
      // when
      const computeOrganizationLearnerCertificability = model.computeOrganizationLearnerCertificability;

      // then
      assert.true(computeOrganizationLearnerCertificability);
    });

    test('it returns false when feature is disabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY']: { active: false, params: null } },
      });
      // when
      const computeOrganizationLearnerCertificability = model.computeOrganizationLearnerCertificability;

      // then
      assert.false(computeOrganizationLearnerCertificability);
    });
  });

  module('#placesManagement', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['PLACES_MANAGEMENT']: { active: true, params: null } },
      });
      // when
      const placesManagement = model.placesManagement;

      // then
      assert.true(placesManagement);
    });

    test('it returns false when feature is disabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['PLACES_MANAGEMENT']: { active: false, params: null } },
      });
      // when
      const placesManagement = model.placesManagement;

      // then
      assert.false(placesManagement);
    });
  });

  module('#attestationsManagement', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['ATTESTATIONS_MANAGEMENT']: { active: true, params: null } },
      });
      // when
      const attestationsManagement = model.attestationsManagement;

      // then
      assert.true(attestationsManagement);
    });

    test('it returns false when feature is disabled ', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['ATTESTATIONS_MANAGEMENT']: { active: false, params: null } },
      });
      // when
      const attestationsManagement = model.attestationsManagement;

      // then
      assert.false(attestationsManagement);
    });
  });

  module('#missionsManagement', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['MISSIONS_MANAGEMENT']: { active: true, params: null } },
      });
      // when
      const missionsManagement = model.missionsManagement;

      // then
      assert.true(missionsManagement);
    });

    test('it returns false when feature is disabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['MISSIONS_MANAGEMENT']: { active: false, params: null } },
      });
      // when
      const missionsManagement = model.missionsManagement;

      // then
      assert.false(missionsManagement);
    });
  });

  module('#hasOrganizationLearnerImport', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['LEARNER_IMPORT']: { active: true, params: null } },
      });

      // when
      const { hasOrganizationLearnerImport } = model;

      // then
      assert.true(hasOrganizationLearnerImport);
    });

    test('it returns false when feature is disabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['LEARNER_IMPORT']: { active: false, params: null } },
      });

      // when
      const { hasOrganizationLearnerImport } = model;

      // then
      assert.false(hasOrganizationLearnerImport);
    });
  });

  module('#hasCoverRateFeature', function () {
    test('it returns true when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['COVER_RATE']: { active: true, params: null } },
      });

      // when
      const { hasCoverRateFeature } = model;

      // then
      assert.true(hasCoverRateFeature);
    });

    test('it returns false when feature is disabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['COVER_RATE']: { active: false, params: null } },
      });

      // when
      const { hasCoverRateFeature } = model;

      // then
      assert.false(hasCoverRateFeature);
    });
  });

  module('#availableAttestations', function () {
    test('it returns attestation keys when feature is enabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['ATTESTATIONS_MANAGEMENT']: { active: true, params: ['SIXTH_GRADE', 'PARENTHOOD'] } },
      });

      // when
      const { availableAttestations } = model;

      // then
      assert.deepEqual(availableAttestations, ['SIXTH_GRADE', 'PARENTHOOD']);
    });

    test('it returns empty array when feature is disabled', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: { ['ATTESTATIONS_MANAGEMENT']: { active: false, params: null } },
      });

      // when
      const { availableAttestations } = model;

      // then
      assert.deepEqual(availableAttestations, []);
    });

    test('it returns empty array when feature is not present', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('prescriber', {
        features: {},
      });

      // when
      const { availableAttestations } = model;

      // then
      assert.deepEqual(availableAttestations, []);
    });
  });
});
