import { Version } from '../../domain/models/Version.js';

const deserialize = (json) => {
  const attributes = json.data.attributes;

  return new Version({
    id: json.data.id,
    scope: attributes.scope,
    startDate: new Date(attributes['start-date']),
    expirationDate: attributes['expiration-date'] ? new Date(attributes['expiration-date']) : null,
    assessmentDuration: attributes['assessment-duration'],
    globalScoringConfiguration: attributes['global-scoring-configuration'],
    competencesScoringConfiguration: attributes['competences-scoring-configuration'],
    challengesConfiguration: attributes['challenges-configuration'],
  });
};

export { deserialize };
