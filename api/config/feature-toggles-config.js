export default {
  dynamicFeatureToggleSystem: {
    description: 'Used to test the dynamic feature toggle system',
    type: 'boolean',
    defaultValue: false,
    tags: ['frontend'],
  },
  isResultsSharedModalEnabled: {
    description: 'Used to enable displaying the "results shared!" modal',
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
