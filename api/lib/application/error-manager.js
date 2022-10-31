const _ = require('lodash');
const JSONAPIError = require('jsonapi-serializer').Error;
const HttpErrors = require('./http-errors');
const DomainErrors = require('../domain/errors');
const errorSerializer = require('../infrastructure/serializers/jsonapi/error-serializer');
const { extractLocaleFromRequest } = require('../infrastructure/utils/request-response-utils');
const translations = require('../../translations');

const NOT_VALID_RELATIONSHIPS = ['externalId', 'participantExternalId'];

function translateMessage(locale, key) {
  if (translations[locale]['entity-validation-errors'][key]) {
    return translations[locale]['entity-validation-errors'][key];
  }
  return key;
}

function _formatAttribute({ attribute, message, locale }) {
  return {
    status: '422',
    source: {
      pointer: `/data/attributes/${_.kebabCase(attribute)}`,
    },
    title: `Invalid data attribute "${attribute}"`,
    detail: translateMessage(locale, message),
  };
}

function _formatRelationship({ attribute, message, locale }) {
  const relationship = attribute.replace('Id', '');
  return {
    status: '422',
    source: {
      pointer: `/data/relationships/${_.kebabCase(relationship)}`,
    },
    title: `Invalid relationship "${relationship}"`,
    detail: translateMessage(locale, message),
  };
}

function _formatUndefinedAttribute({ message, locale }) {
  return {
    status: '422',
    title: 'Invalid data attributes',
    detail: translateMessage(locale, message),
  };
}

function _formatInvalidAttribute(locale, { attribute, message }) {
  if (!attribute) {
    return _formatUndefinedAttribute({ message, locale });
  }
  if (attribute.endsWith('Id') && !NOT_VALID_RELATIONSHIPS.includes(attribute)) {
    return _formatRelationship({ attribute, message, locale });
  }
  return _formatAttribute({ attribute, message, locale });
}

function _mapToHttpError(error) {
  if (error instanceof DomainErrors.AlreadyRatedAssessmentError) {
    return new HttpErrors.PreconditionFailedError('Assessment is already rated.');
  }
  if (error instanceof DomainErrors.ChallengeAlreadyAnsweredError) {
    return new HttpErrors.ConflictError('This challenge has already been answered.');
  }
  if (error instanceof DomainErrors.ChallengeNotAskedError) {
    return new HttpErrors.ConflictError('This challenge has not been asked to the user.');
  }
  if (error instanceof DomainErrors.UserNotAuthorizedToAccessEntityError) {
    return new HttpErrors.ForbiddenError('Utilisateur non autorisé à accéder à la ressource');
  }
  if (error instanceof DomainErrors.CertificationCandidateAlreadyLinkedToUserError) {
    return new HttpErrors.ForbiddenError('Le candidat de certification est déjà lié à un utilisateur.');
  }
  if (error instanceof DomainErrors.CertificationCandidateByPersonalInfoNotFoundError) {
    return new HttpErrors.NotFoundError(
      "Aucun candidat de certification ne correspond aux informations d'identité fournies."
    );
  }
  if (error instanceof DomainErrors.CertificationCandidateByPersonalInfoTooManyMatchesError) {
    return new HttpErrors.ConflictError(
      "Plus d'un candidat de certification correspondent aux informations d'identité fournies."
    );
  }
  if (error instanceof DomainErrors.CertificationCandidatePersonalInfoFieldMissingError) {
    return new HttpErrors.BadRequestError("Un ou plusieurs champs d'informations d'identité sont manquants.");
  }
  if (error instanceof DomainErrors.CertificationCandidatePersonalInfoWrongFormat) {
    return new HttpErrors.BadRequestError("Un ou plusieurs champs d'informations d'identité sont au mauvais format.");
  }
  if (error instanceof DomainErrors.CertificationCenterMembershipCreationError) {
    return new HttpErrors.BadRequestError("Le membre ou le centre de certification n'existe pas.");
  }
  if (error instanceof DomainErrors.UserAlreadyLinkedToCandidateInSessionError) {
    return new HttpErrors.ForbiddenError("L'utilisateur est déjà lié à un candidat dans cette session.");
  }
  if (error instanceof DomainErrors.UserNotAuthorizedToCertifyError) {
    return new HttpErrors.ForbiddenError('The user cannot be certified.');
  }
  if (error instanceof DomainErrors.MissingOrInvalidCredentialsError) {
    return new HttpErrors.UnauthorizedError("L'adresse e-mail et/ou le mot de passe saisis sont incorrects.");
  }
  if (error instanceof DomainErrors.ApplicationWithInvalidClientIdError) {
    return new HttpErrors.UnauthorizedError('The client ID is invalid.');
  }
  if (error instanceof DomainErrors.ApplicationWithInvalidClientSecretError) {
    return new HttpErrors.UnauthorizedError('The client secret is invalid.');
  }
  if (error instanceof DomainErrors.ApplicationScopeNotAllowedError) {
    return new HttpErrors.ForbiddenError('The scope is not allowed.');
  }

  switch (error.constructor) {
    case DomainErrors.ImproveCompetenceEvaluationForbiddenError:
      return new HttpErrors.ImproveCompetenceEvaluationForbiddenError(error.message);

    case DomainErrors.SendingEmailToRefererError:
    case DomainErrors.SendingEmailToResultRecipientError:
    case DomainErrors.InvalidExternalAPIResponseError:
      return new HttpErrors.ServiceUnavailableError(error.message);

    case DomainErrors.UserShouldChangePasswordError:
      return new HttpErrors.PasswordShouldChangeError(error.message, error.meta);

    case DomainErrors.InvalidJuryLevelError:
    case DomainErrors.InvalidIdentityProviderError:
    case DomainErrors.UnexpectedOidcStateError:
    case DomainErrors.InvalidPasswordForUpdateEmailError:
    case DomainErrors.InvalidMembershipOrganizationRoleError:
    case DomainErrors.NoCertificationAttestationForDivisionError:
    case DomainErrors.InvalidCertificationReportForFinalization:
    case DomainErrors.MissingUserAccountError:
    case DomainErrors.MembershipCreationError:
    case DomainErrors.MembershipUpdateError:
    case DomainErrors.OrganizationLearnersCouldNotBeSavedError:
    case DomainErrors.AlreadyRegisteredEmailAndUsernameError:
    case DomainErrors.AlreadyRegisteredEmailError:
    case DomainErrors.AlreadyRegisteredUsernameError:
    case DomainErrors.WrongDateFormatError:
    case DomainErrors.SessionAlreadyFinalizedError:
    case DomainErrors.SessionWithoutStartedCertificationError:
    case DomainErrors.OrganizationLearnerAlreadyLinkedToInvalidUserError:
    case DomainErrors.MatchingReconciledStudentNotFoundError:
    case DomainErrors.UserOrgaSettingsCreationError:
      return new HttpErrors.BadRequestError(error.message, error.code, error.meta);

    case DomainErrors.CertificationAttestationGenerationError:
    case DomainErrors.AlreadyExistingAdminMemberError:
    case DomainErrors.UserShouldNotBeReconciledOnAnotherAccountError:
    case DomainErrors.UncancellableOrganizationInvitationError:
    case DomainErrors.CpfBirthInformationValidationError:
    case DomainErrors.UnknownCountryForStudentEnrollmentError:
    case DomainErrors.YamlParsingError:
    case DomainErrors.AdminMemberError:
    case DomainErrors.OrganizationArchivedError:
    case DomainErrors.MissingAttributesError:
    case DomainErrors.AuthenticationMethodAlreadyExistsError:
    case DomainErrors.CertificationCandidateAddError:
    case DomainErrors.CertificationCandidatesImportError:
    case DomainErrors.InvalidCertificationCandidate:
    case DomainErrors.ObjectValidationError:
    case DomainErrors.FileValidationError:
    case DomainErrors.UserNotMemberOfOrganizationError:
    case DomainErrors.UserCouldNotBeReconciledError:
    case DomainErrors.TargetProfileCannotBeCreated:
      return new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta);

    case DomainErrors.DifferentExternalIdentifierError:
    case DomainErrors.CertificationEndedByFinalizationError:
    case DomainErrors.MultipleOrganizationLearnersWithDifferentNationalStudentIdError:
    case DomainErrors.AccountRecoveryUserAlreadyConfirmEmail:
    case DomainErrors.DeletedError:
    case DomainErrors.UserAlreadyExistsWithAuthenticationMethodError:
    case DomainErrors.UnexpectedUserAccountError:
    case DomainErrors.AlreadyAcceptedOrCancelledOrganizationInvitationError:
    case DomainErrors.ManyOrganizationsFoundError:
    case DomainErrors.AssessmentNotCompletedError:
    case DomainErrors.SessionWithAbortReasonOnCompletedCertificationCourseError:
    case DomainErrors.SessionStartedDeletionError:
    case DomainErrors.OrganizationLearnerAlreadyLinkedToUserError:
      return new HttpErrors.ConflictError(error.message, error.code, error.meta);

    case DomainErrors.OrganizationLearnerCannotBeDissociatedError:
    case DomainErrors.CsvImportError:
    case DomainErrors.SiecleXmlImportError:
    case DomainErrors.TargetProfileInvalidError:
    case DomainErrors.NoStagesForCampaign:
    case DomainErrors.SessionNotAccessible:
    case DomainErrors.CampaignTypeError:
    case DomainErrors.ArchivedCampaignError:
    case DomainErrors.CampaignParticipationDeletedError:
    case DomainErrors.CompetenceResetError:
    case DomainErrors.NoCampaignParticipationForUserAndCampaign:
    case DomainErrors.OrganizationLearnerDisabledError:
    case DomainErrors.NoOrganizationToAttach:
    case DomainErrors.AlreadyExistingEntityError:
    case DomainErrors.AlreadyExistingMembershipError:
    case DomainErrors.AlreadyExistingOrganizationInvitationError:
    case DomainErrors.AlreadyExistingCampaignParticipationError:
    case DomainErrors.AlreadySharedCampaignParticipationError:
    case DomainErrors.OrganizationWithoutEmailError:
      return new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta);

    case DomainErrors.CertificationCandidateOnFinalizedSessionError:
    case DomainErrors.CandidateNotAuthorizedToResumeCertificationTestError:
    case DomainErrors.CandidateNotAuthorizedToJoinSessionError:
    case DomainErrors.UserNotAuthorizedToGetCampaignResultsError:
    case DomainErrors.UserNotAuthorizedToUpdatePasswordError:
    case DomainErrors.UserNotAuthorizedToUpdateEmailError:
    case DomainErrors.UserNotAuthorizedToCreateResourceError:
    case DomainErrors.InvalidVerificationCodeError:
    case DomainErrors.EmailModificationDemandNotFoundOrExpiredError:
    case DomainErrors.UserHasAlreadyLeftSCO:
    case DomainErrors.UserNotAuthorizedToUpdateResourceError:
    case DomainErrors.UserNotAuthorizedToCreateCampaignError:
    case DomainErrors.UserNotAuthorizedToGetCertificationCoursesError:
    case DomainErrors.UserNotAuthorizedToGenerateUsernamePasswordError:
    case DomainErrors.UserNotAuthorizedToRemoveAuthenticationMethod:
    case DomainErrors.CertificationCandidateForbiddenDeletionError:
    case DomainErrors.CancelledOrganizationInvitationError:
    case DomainErrors.ForbiddenAccess:
      return new HttpErrors.ForbiddenError(error.message, error.code, error.meta);

    case DomainErrors.AccountRecoveryDemandExpired:
    case DomainErrors.AuthenticationKeyExpired:
    case DomainErrors.UserCantBeCreatedError:
    case DomainErrors.PasswordNotMatching:
    case DomainErrors.InvalidExternalUserTokenError:
    case DomainErrors.InvalidResultRecipientTokenError:
    case DomainErrors.InvalidTemporaryKeyError:
    case DomainErrors.SupervisorAccessNotAuthorizedError:
      return new HttpErrors.UnauthorizedError(error.message, error.code, error.meta);

    case DomainErrors.ChallengeToBeNeutralizedNotFoundError:
    case DomainErrors.ChallengeToBeDeneutralizedNotFoundError:
    case DomainErrors.NotFoundError:
    case DomainErrors.CampaignCodeError:
    case DomainErrors.NoCertificationResultForDivision:
    case DomainErrors.OrganizationNotFoundError:
    case DomainErrors.UserNotFoundError:
    case DomainErrors.PasswordResetDemandNotFoundError:
      return new HttpErrors.NotFoundError(error.message, error.code, error.meta);

    case HttpErrors.BaseHttpError:
      return error;

    default:
      return new HttpErrors.BaseHttpError(error.message);
  }
}

function handle(request, h, error) {
  if (error instanceof DomainErrors.EntityValidationError) {
    const locale = extractLocaleFromRequest(request).split('-')[0];

    const jsonApiError = new JSONAPIError(
      error.invalidAttributes?.map(_formatInvalidAttribute.bind(_formatInvalidAttribute, locale))
    );
    return h.response(jsonApiError).code(422);
  }

  const httpError = _mapToHttpError(error);

  return h.response(errorSerializer.serialize(httpError)).code(httpError.status);
}

module.exports = { handle };
