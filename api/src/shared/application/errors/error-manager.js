import { AdminMemberError } from '../../../authorization/domain/errors.js';
import { AlreadyRatedAssessmentError, EmptyAnswerError } from '../../../evaluation/domain/errors.js';
import * as LLMDomainErrors from '../../../llm/domain/errors.js';
import {
  ArchiveOrganizationError,
  UnableToAttachChildOrganizationToParentOrganizationError,
} from '../../../organizational-entities/domain/errors.js';
import { OrganizationCantGetPlacesStatisticsError } from '../../../prescription/organization-place/domain/errors.js';
import {
  AlreadyAcceptedOrCancelledInvitationError,
  UserHasNoOrganizationMembershipError,
  UserNotMemberOfOrganizationError,
} from '../../../team/domain/errors.js';
import * as SharedDomainErrors from '../../domain/errors.js';
import { HttpErrors } from './http-errors.js';

const NOT_FOUND_ERRORS = [
  SharedDomainErrors.NotFoundError,
  SharedDomainErrors.UserNotFoundError,
  SharedDomainErrors.OrganizationNotFoundError,
  SharedDomainErrors.CampaignCodeError,
  LLMDomainErrors.ChatNotFoundError,
];

const FORBIDDEN_ERRORS = [
  SharedDomainErrors.ForbiddenAccess,
  SharedDomainErrors.UserIsTemporaryBlocked,
  SharedDomainErrors.UserHasAlreadyLeftSCO,
  SharedDomainErrors.UserIsBlocked,
  SharedDomainErrors.InvalidVerificationCodeError,
  SharedDomainErrors.EmailModificationDemandNotFoundOrExpiredError,
  SharedDomainErrors.UserNotAuthorizedToUpdateEmailError,
  SharedDomainErrors.UserNotAuthorizedToUpdatePasswordError,
  SharedDomainErrors.CandidateAlreadyLinkedToUserError,
  SharedDomainErrors.UserNotAuthorizedToUpdateResourceError,
  SharedDomainErrors.UserNotAuthorizedToGenerateUsernamePasswordError,
  SharedDomainErrors.UserNotAuthorizedToRemoveAuthenticationMethod,
  SharedDomainErrors.UserNotAuthorizedToGetCampaignResultsError,
  SharedDomainErrors.UserNotAuthorizedToCreateResourceError,
  SharedDomainErrors.CancelledInvitationError,
  SharedDomainErrors.CandidateNotAuthorizedToJoinSessionError,
  SharedDomainErrors.CandidateNotAuthorizedToResumeCertificationTestError,
  SharedDomainErrors.CertificationCandidateOnFinalizedSessionError,
  UserHasNoOrganizationMembershipError,
  LLMDomainErrors.MaxPromptsReachedError,
  LLMDomainErrors.ChatForbiddenError,
];

const CONFLICT_ERRORS = [
  SharedDomainErrors.ChallengeAlreadyAnsweredError,
  SharedDomainErrors.UserAlreadyExistsWithAuthenticationMethodError,
  SharedDomainErrors.UnexpectedUserAccountError,
  SharedDomainErrors.AccountRecoveryUserAlreadyConfirmEmail,
  SharedDomainErrors.OrganizationLearnerAlreadyLinkedToUserError,
  SharedDomainErrors.AssessmentNotCompletedError,
  SharedDomainErrors.ManyOrganizationsFoundError,
  SharedDomainErrors.OrganizationLearnersConstraintError,
  SharedDomainErrors.DeletedError,
  SharedDomainErrors.CertificationEndedByFinalizationError,
  SharedDomainErrors.MultipleOrganizationLearnersWithDifferentNationalStudentIdError,
  UnableToAttachChildOrganizationToParentOrganizationError,
  AlreadyAcceptedOrCancelledInvitationError,
  LLMDomainErrors.PromptAlreadyOngoingError,
];

const PRECONDITION_FAILED_ERRORS = [
  SharedDomainErrors.CsvImportError,
  SharedDomainErrors.AlreadyExistingEntityError,
  SharedDomainErrors.InvalidInputDataError,
  SharedDomainErrors.CampaignParticipationDeletedError,
  SharedDomainErrors.NotEnoughDaysPassedBeforeResetCampaignParticipationError,
  SharedDomainErrors.NoCampaignParticipationForUserAndCampaign,
  SharedDomainErrors.OrganizationLearnerDisabledError,
  SharedDomainErrors.NoOrganizationToAttach,
  SharedDomainErrors.OrganizationLearnerCannotBeDissociatedError,
  SharedDomainErrors.AlreadyExistingMembershipError,
  SharedDomainErrors.AlreadyExistingInvitationError,
  SharedDomainErrors.AlreadyExistingCampaignParticipationError,
  SharedDomainErrors.AlreadySharedCampaignParticipationError,
  SharedDomainErrors.OrganizationWithoutEmailError,
  SharedDomainErrors.TargetProfileInvalidError,
  SharedDomainErrors.NoStagesForCampaign,
  SharedDomainErrors.CampaignTypeError,
  OrganizationCantGetPlacesStatisticsError,
];

const BAD_REQUEST_ERRORS = [
  SharedDomainErrors.AlreadyRegisteredEmailError,
  SharedDomainErrors.NoCertificateForDivisionError,
  SharedDomainErrors.LanguageNotSupportedError,
  SharedDomainErrors.InvalidPasswordForUpdateEmailError,
  SharedDomainErrors.AlreadyRegisteredEmailAndUsernameError,
  SharedDomainErrors.AlreadyRegisteredUsernameError,
  SharedDomainErrors.WrongDateFormatError,
  SharedDomainErrors.OrganizationLearnerAlreadyLinkedToInvalidUserError,
  SharedDomainErrors.MatchingReconciledStudentNotFoundError,
  SharedDomainErrors.MembershipCreationError,
  SharedDomainErrors.MembershipUpdateError,
  SharedDomainErrors.OrganizationLearnersCouldNotBeSavedError,
  SharedDomainErrors.InvalidMembershipOrganizationRoleError,
  SharedDomainErrors.InvalidIdentityProviderError,
  SharedDomainErrors.InvalidJuryLevelError,
  SharedDomainErrors.InvalidSessionResultTokenError,
  SharedDomainErrors.UserOrgaSettingsCreationError,
  SharedDomainErrors.AutonomousCourseRequiresATargetProfileWithSimplifiedAccessError,
  SharedDomainErrors.TargetProfileRequiresToBeLinkedToAutonomousCourseOrganization,
  EmptyAnswerError,
  LLMDomainErrors.ConfigurationNotFoundError,
  LLMDomainErrors.NoUserIdProvidedError,
  LLMDomainErrors.NoAttachmentNeededError,
  LLMDomainErrors.NoAttachmentNorMessageProvidedError,
];

const UNPROCESSABLE_ENTITY_ERRORS = [
  SharedDomainErrors.UserCouldNotBeReconciledError,
  AdminMemberError,
  SharedDomainErrors.OidcError,
  SharedDomainErrors.AuthenticationMethodAlreadyExistsError,
  SharedDomainErrors.MissingAttributesError,
  SharedDomainErrors.CertificationCandidatesError,
  SharedDomainErrors.ObjectValidationError,
  SharedDomainErrors.FileValidationError,
  SharedDomainErrors.OidcMissingFieldsError,
  SharedDomainErrors.YamlParsingError,
  SharedDomainErrors.UserShouldNotBeReconciledOnAnotherAccountError,
  UserNotMemberOfOrganizationError,
  ArchiveOrganizationError,
  SharedDomainErrors.FeatureDisabledError,
];

const UNAUTHORIZED_ERRORS = [
  SharedDomainErrors.InvalidExternalUserTokenError,
  SharedDomainErrors.InvalidResultRecipientTokenError,
  SharedDomainErrors.InvalidTemporaryKeyError,
  SharedDomainErrors.AccountRecoveryDemandExpired,
];

const SERVICE_UNAVAILABLE_ERRORS = [
  SharedDomainErrors.SendingEmailError,
  SharedDomainErrors.InvalidExternalAPIResponseError,
  LLMDomainErrors.LLMApiError,
];

const INTERNAL_SERVER_ERRORS = [LLMDomainErrors.IncorrectMessagesOrderingError];

const PAYLOAD_TOO_LARGE_ERRORS = [LLMDomainErrors.TooLargeMessageInputError];

export function mapToHttpError(error) {
  // Special cases: hardcoded messages or non-standard patterns
  if (error instanceof SharedDomainErrors.UserNotAuthorizedToAccessEntityError) {
    return new HttpErrors.ForbiddenError('Utilisateur non autorisé à accéder à la ressource');
  }
  if (error instanceof SharedDomainErrors.UserAlreadyLinkedToCandidateInSessionError) {
    return new HttpErrors.ForbiddenError("L'utilisateur est déjà lié à un candidat dans cette session.");
  }
  if (error instanceof SharedDomainErrors.ApplicationWithInvalidCredentialsError) {
    return new HttpErrors.UnauthorizedError('The client ID and/or secret are invalid.');
  }
  if (error instanceof AlreadyRatedAssessmentError) {
    return new HttpErrors.PreconditionFailedError('Assessment is already rated.');
  }
  if (error instanceof SharedDomainErrors.ChallengeNotAskedError) {
    return new HttpErrors.ConflictError('This challenge has not been asked to the user.');
  }
  if (error instanceof SharedDomainErrors.CertificationCandidateByPersonalInfoNotFoundError) {
    return new HttpErrors.NotFoundError(
      "Aucun candidat de certification ne correspond aux informations d'identité fournies.",
    );
  }
  if (error instanceof SharedDomainErrors.CertificationCandidateByPersonalInfoTooManyMatchesError) {
    return new HttpErrors.ConflictError(
      "Plus d'un candidat de certification correspondent aux informations d'identité fournies.",
    );
  }
  if (error instanceof SharedDomainErrors.CertificationCandidatePersonalInfoFieldMissingError) {
    return new HttpErrors.BadRequestError("Un ou plusieurs champs d'informations d'identité sont manquants.");
  }
  if (error instanceof SharedDomainErrors.CertificationCandidatePersonalInfoWrongFormat) {
    return new HttpErrors.BadRequestError("Un ou plusieurs champs d'informations d'identité sont au mauvais format.");
  }
  if (error instanceof SharedDomainErrors.CertificationCenterMembershipCreationError) {
    return new HttpErrors.BadRequestError("Le membre ou le centre de certification n'existe pas.");
  }
  if (error instanceof SharedDomainErrors.UserNotAuthorizedToCertifyError) {
    return new HttpErrors.ForbiddenError('The user cannot be certified.');
  }
  if (error instanceof SharedDomainErrors.ApplicationScopeNotAllowedError) {
    return new HttpErrors.ForbiddenError('The scope is not allowed.');
  }
  if (error instanceof SharedDomainErrors.AssessmentEndedError) {
    return new HttpErrors.BaseHttpError(error.message);
  }
  if (error instanceof SharedDomainErrors.SendingEmailToInvalidDomainError) {
    return new HttpErrors.BadRequestError(error.message, 'SENDING_EMAIL_TO_INVALID_DOMAIN');
  }
  if (error instanceof SharedDomainErrors.SendingEmailToInvalidEmailAddressError) {
    return new HttpErrors.BadRequestError(error.message, 'SENDING_EMAIL_TO_INVALID_EMAIL_ADDRESS', error.meta);
  }

  // Standard mapping by HTTP error type
  if (NOT_FOUND_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.NotFoundError(error.message, error.code, error.meta);
  if (FORBIDDEN_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.ForbiddenError(error.message, error.code, error.meta);
  if (CONFLICT_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.ConflictError(error.message, error.code, error.meta);
  if (PRECONDITION_FAILED_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta);
  if (BAD_REQUEST_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.BadRequestError(error.message, error.code, error.meta);
  if (UNPROCESSABLE_ENTITY_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta);
  if (UNAUTHORIZED_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.UnauthorizedError(error.message, error.code, error.meta);
  if (SERVICE_UNAVAILABLE_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.ServiceUnavailableError(error.message);
  if (INTERNAL_SERVER_ERRORS.some((E) => error instanceof E)) return new HttpErrors.InternalServerError(error.message);
  if (PAYLOAD_TOO_LARGE_ERRORS.some((E) => error instanceof E))
    return new HttpErrors.PayloadTooLargeError(error.message, error.code, error.meta);

  return new HttpErrors.BaseHttpError(error.message);
}
