import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (results) {
  return new Serializer('campaign-result-levels-per-tubes-and-competences', {
    attributes: ['levelsPerCompetence', 'maxReachableLevel', 'meanReachedLevel'],
    transform(results) {
      const levelsPerCompetence = results.levelsPerCompetence.map((competence) => {
        return {
          ...competence,
          levelsPerTube: results.levelsPerTube.filter((tube) => tube.competenceId === competence.id),
        };
      }, []);

      return {
        id: results.id,
        maxReachableLevel: results.maxReachableLevel,
        meanReachedLevel: results.meanReachedLevel,
        levelsPerCompetence,
      };
    },
    levelsPerCompetence: {
      ref: 'id',
      includes: true,
      attributes: ['index', 'name', 'description', 'maxLevel', 'meanLevel', 'levelsPerTube'],
      levelsPerTube: {
        ref: 'id',
        includes: true,
        attributes: ['competenceId', 'competenceName', 'title', 'description', 'maxLevel', 'meanLevel'],
      },
    },
  }).serialize(results);
};

export { serialize };
