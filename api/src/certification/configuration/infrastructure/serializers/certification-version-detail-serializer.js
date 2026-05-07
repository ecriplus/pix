import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

export const serialize = ({ version, areas }) => {
  const data = {
    id: version.id,
    startDate: version.startDate,
    expirationDate: version.expirationDate,
    assessmentDuration: version.assessmentDuration,
    minimumAnswers: version.minimumAnswersRequiredToValidateACertification,
    maximumAssessmentLength: version.challengesConfiguration?.maximumAssessmentLength,
    areas,
  };

  return new Serializer('certification-versions', {
    attributes: [
      'startDate',
      'expirationDate',
      'assessmentDuration',
      'minimumAnswers',
      'maximumAssessmentLength',
      'areas',
    ],
    areas: {
      ref: 'id',
      included: true,
      attributes: ['title', 'code', 'color', 'frameworkId', 'competences'],
      competences: {
        ref: 'id',
        included: true,
        attributes: ['name', 'index', 'thematics'],
        thematics: {
          ref: 'id',
          included: true,
          attributes: ['name', 'index', 'tubes'],
          tubes: {
            ref: 'id',
            included: true,
            attributes: ['name', 'practicalTitle', 'level', 'mobile', 'tablet', 'skills'],
            skills: {
              ref: 'id',
              included: true,
              attributes: ['difficulty'],
            },
          },
        },
      },
    },
  }).serialize(data);
};
