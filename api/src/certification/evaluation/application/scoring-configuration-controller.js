import { usecases } from '../domain/usecases/index.js';

const saveCompetenceForScoringConfiguration = async (request, h) => {
  const configuration = request.payload;
  await usecases.saveCompetenceForScoringConfiguration({ configuration });
  return h.response().code(201);
};

const saveCertificationScoringConfiguration = async (request, h) => {
  const configuration = request.payload;
  await usecases.saveCertificationScoringConfiguration({ configuration });
  return h.response().code(201);
};

export const scoringConfigurationController = {
  saveCompetenceForScoringConfiguration,
  saveCertificationScoringConfiguration,
};
