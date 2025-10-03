import { DEFAULT_SESSION_DURATION_MINUTES } from '../../../../../../src/certification/shared/domain/constants.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';

export const createCertificationVersion = ({ databaseBuilder }) => {
  _createExpiredVersion({ databaseBuilder });
  _createActiveVersion({ databaseBuilder });
};

const _createActiveVersion = ({ databaseBuilder }) => {
  databaseBuilder.factory.buildCertificationVersion({
    scope: Frameworks.CORE,
    startDate: new Date('2024-10-19'),
    expirationDate: null,
    assessmentDuration: DEFAULT_SESSION_DURATION_MINUTES,
    globalScoringConfiguration,
    competencesScoringConfiguration,
    challengesConfiguration,
  });
};

const _createExpiredVersion = ({ databaseBuilder }) => {
  databaseBuilder.factory.buildCertificationVersion({
    scope: Frameworks.CORE,
    startDate: new Date('2018-10-19'),
    expirationDate: new Date('2024-10-19'),
    assessmentDuration: 90,
    globalScoringConfiguration: null,
    competencesScoringConfiguration: null,
    challengesConfiguration: {
      maximumAssessmentLength: 20,
      challengesBetweenSameCompetence: null,
      limitToOneQuestionPerTube: false,
      enablePassageByAllCompetences: false,
      variationPercent: 0.3,
    },
  });
};

const challengesConfiguration = {
  maximumAssessmentLength: 32,
  challengesBetweenSameCompetence: null,
  limitToOneQuestionPerTube: true,
  enablePassageByAllCompetences: true,
  variationPercent: 0.5,
};

const globalScoringConfiguration = [
  {
    meshLevel: 0,
    bounds: {
      min: -8,
      max: -1.4,
    },
  },
  {
    meshLevel: 1,
    bounds: {
      min: -1.4,
      max: -0.519,
    },
  },
  {
    meshLevel: 2,
    bounds: {
      min: -0.519,
      max: 0.6,
    },
  },
  {
    meshLevel: 3,
    bounds: {
      min: 0.6,
      max: 1.5,
    },
  },
  {
    meshLevel: 4,
    bounds: {
      min: 1.5,
      max: 2.25,
    },
  },
  {
    meshLevel: 5,
    bounds: {
      min: 2.25,
      max: 3.1,
    },
  },
  {
    meshLevel: 6,
    bounds: {
      min: 3.1,
      max: 4,
    },
  },
  {
    meshLevel: 7,
    bounds: {
      min: 4,
      max: 8,
    },
  },
];

const competencesScoringConfiguration = [
  {
    competence: '1.1',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '1.2',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '1.3',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '2.1',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '2.2',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '2.3',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '2.4',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '3.1',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '3.2',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '3.3',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '3.4',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '4.1',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '4.2',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '4.3',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '5.1',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
  {
    competence: '5.2',
    values: [
      {
        bounds: {
          max: -2,
          min: Number.MIN_SAFE_INTEGER,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: -1,
          min: -2,
        },
        competenceLevel: 1,
      },
      {
        bounds: {
          max: 0.5,
          min: -1,
        },
        competenceLevel: 2,
      },
      {
        bounds: {
          max: 1,
          min: 0.5,
        },
        competenceLevel: 3,
      },
      {
        bounds: {
          max: 2,
          min: 1,
        },
        competenceLevel: 4,
      },
      {
        bounds: {
          max: 3,
          min: 2,
        },
        competenceLevel: 5,
      },
      {
        bounds: {
          max: 4,
          min: 3,
        },
        competenceLevel: 6,
      },
      {
        bounds: {
          max: Number.MAX_SAFE_INTEGER,
          min: 4,
        },
        competenceLevel: 7,
      },
    ],
  },
];
