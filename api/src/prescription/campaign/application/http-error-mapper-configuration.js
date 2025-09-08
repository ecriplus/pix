import { HttpErrors } from '../../../shared/application/http-errors.js';
import {
  CampaignBelongsToCombinedCourseError,
  CampaignCodeFormatError,
  CampaignParticipationDoesNotBelongToUser,
  CampaignUniqueCodeError,
  IsForAbsoluteNoviceUpdateError,
  MultipleSendingsUpdateError,
  OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError,
  OrganizationNotAuthorizedToCreateCampaignError,
  SwapCampaignMismatchOrganizationError,
  UnknownCampaignId,
  UserNotAuthorizedToCreateCampaignError,
} from '../../campaign/domain/errors.js';

const campaignDomainErrorMappingConfiguration = [
  {
    name: UnknownCampaignId.name,
    httpErrorFn: (error) => {
      return new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta);
    },
  },
  {
    name: SwapCampaignMismatchOrganizationError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code, error.meta),
  },
  {
    name: IsForAbsoluteNoviceUpdateError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code, error.meta),
  },
  {
    name: MultipleSendingsUpdateError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code, error.meta),
  },
  {
    name: CampaignUniqueCodeError.name,
    httpErrorFn: (error) => new HttpErrors.ConflictError(error.message, error.code, error.meta),
  },
  {
    name: CampaignCodeFormatError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
  },
  {
    name: CampaignParticipationDoesNotBelongToUser.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code, error.meta),
  },
  {
    name: UserNotAuthorizedToCreateCampaignError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message),
  },
  {
    name: OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message),
  },
  {
    name: OrganizationNotAuthorizedToCreateCampaignError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message),
  },
  {
    name: CampaignBelongsToCombinedCourseError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code),
  },
];

export { campaignDomainErrorMappingConfiguration };
