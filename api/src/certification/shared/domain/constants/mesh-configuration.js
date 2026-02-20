export const CERTIFICATE_LEVELS = {
  preBeginner: 'LEVEL_PRE_BEGINNER',
  beginner1: 'LEVEL_BEGINNER_1',
  beginner2: 'LEVEL_BEGINNER_2',
  independent3: 'LEVEL_INDEPENDENT_3',
  independent4: 'LEVEL_INDEPENDENT_4',
  advanced5: 'LEVEL_ADVANCED_5',
  advanced6: 'LEVEL_ADVANCED_6',
  expert7: 'LEVEL_EXPERT_7',
  expert8: 'LEVEL_EXPERT_8',
};

export const MESH_CONFIGURATION = new Map([
  [CERTIFICATE_LEVELS.preBeginner, { weight: 64, coefficient: 0 }],
  [CERTIFICATE_LEVELS.beginner1, { weight: 64, coefficient: 1 }],
  [CERTIFICATE_LEVELS.beginner2, { weight: 128, coefficient: 1 }],
  [CERTIFICATE_LEVELS.independent3, { weight: 128, coefficient: 2 }],
  [CERTIFICATE_LEVELS.independent4, { weight: 128, coefficient: 3 }],
  [CERTIFICATE_LEVELS.advanced5, { weight: 128, coefficient: 4 }],
  [CERTIFICATE_LEVELS.advanced6, { weight: 128, coefficient: 5 }],
  [CERTIFICATE_LEVELS.expert7, { weight: 128, coefficient: 6 }],
  [CERTIFICATE_LEVELS.expert8, { weight: 128, coefficient: 7 }],
]);
