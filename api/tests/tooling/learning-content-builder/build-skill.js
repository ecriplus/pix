const buildSkill = function buildSkill({
  id = 'recSK123',
  name = '@sau6',
  pixValue = 3,
  competenceId = 'recCOMP123',
  tutorialIds = [],
  learningMoreTutorialIds = [],
  tubeId = 'recTUB123',
  version = 1,
  level = 6,
  status = 'actif',
} = {}) {
  return {
    id,
    name,
    pixValue,
    competenceId,
    tutorialIds,
    learningMoreTutorialIds,
    tubeId,
    version,
    level,
    status,
  };
};

export { buildSkill };
