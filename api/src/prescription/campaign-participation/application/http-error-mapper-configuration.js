import { HttpErrors } from '../../../shared/application/http-errors.js';
import { CampaignParticipationInvalidStatus } from '../domain/errors.js';

const campaignParticipationDomainErrorMappingConfiguration = [
  {
    name: CampaignParticipationInvalidStatus.name,
    httpErrorFn: (error) => {
      return new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta);
    },
  },
];

export { campaignParticipationDomainErrorMappingConfiguration };
