/**
 * @typedef {import ('../../domain/read-models/UserCertificationEligibility.js').UserCertificationEligibility} UserCertificationEligibility
 */
import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

/**
 * @param {UserCertificationEligibility} userCertificationEligibility
 */
const serialize = function (userCertificationEligibility) {
  return new Serializer('isCertifiables', {
    transform(userCertificationEligibility) {
      return {
        id: userCertificationEligibility.id,
        isCertifiable: userCertificationEligibility.isCertifiable,
        doubleCertificationEligibility: {
          label: userCertificationEligibility.doubleCertificationEligibility.label,
          imageUrl: userCertificationEligibility.doubleCertificationEligibility.imageUrl,
          isBadgeOutdated: userCertificationEligibility.doubleCertificationEligibility.isBadgeOutdated,
          validatedDoubleCertification: userCertificationEligibility.doubleCertificationEligibility.validatedDoubleCertification
        }
      }
    },
    attributes: ['isCertifiable', 'doubleCertificationEligibility'],
  }).serialize(userCertificationEligibility);
};

export { serialize };
