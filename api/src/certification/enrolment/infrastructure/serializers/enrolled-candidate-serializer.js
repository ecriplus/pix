import { Serializer } from 'jsonapi-serializer';

import { EditedCandidate } from '../../domain/models/EditedCandidate.js';

// todo move me

// todo delete me
const serialize = function (enrolledCandidates) {
  return new Serializer('certification-candidate', {
    attributes: [
      'firstName',
      'lastName',
      'birthdate',
      'birthProvinceCode',
      'birthCity',
      'birthCountry',
      'email',
      'resultRecipientEmail',
      'externalId',
      'extraTimePercentage',
      'isLinked',
      'organizationLearnerId',
      'sex',
      'birthINSEECode',
      'birthPostalCode',
      'complementaryCertification',
      'subscription',
      'billingMode',
      'prepaymentCode',
      'hasSeenCertificationInstructions',
      'accessibilityAdjustmentNeeded',
    ],
  }).serialize(enrolledCandidates);
};

export { deserialize, serialize };
