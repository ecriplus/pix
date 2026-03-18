import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (certificateSummaries, { translate }) {
  return new Serializer('certification-summaries', {
    transform(certificateSummary) {
      return {
        ...certificateSummary,
        comment: certificateSummary.juryComment.getComment(translate),
      };
    },
    attributes: [
      'verificationCode',
      'certificationStartedAt',
      'certificationFramework',
      'certificationCenterName',
      'pixScore',
      'comment',
      'status',
      'extraCertificationStatus',
    ],
  }).serialize(certificateSummaries);
};

export { serialize };
