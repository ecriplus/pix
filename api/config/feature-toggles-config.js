export default {
  dynamicFeatureToggleSystem: {
    description: 'Used to test the dynamic feature toggle system',
    type: 'boolean',
    defaultValue: false,
    tags: ['frontend'],
  },
  isModalSentResultEnabled: {
    description: 'Used to enable display of sent-results-modal',
    type: 'boolean',
    defaultValue: false,
    tags: ['frontend', 'team-devcomp'],
  },
  isV3CertificationAttestationEnabled: {
    description: 'Used to enable new certification attestation for V3',
    type: 'boolean',
    defaultValue: false,
    tags: ['team-certification'],
  },
};
