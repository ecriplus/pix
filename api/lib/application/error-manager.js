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
  const errorsMapping = {
    [HttpErrors.BaseHttpError.name]: () => error,
    [DomainErrors.AccountRecoveryDemandExpired.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.AdminMemberError.name]: () => new HttpErrors.UnprocessableEntityError(error.message, error.code),
    [DomainErrors.MissingAttributesError.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.OrganizationArchivedError.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.AuthenticationKeyExpired.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.AuthenticationMethodAlreadyExistsError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.UserHasAlreadyLeftSCO.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.AccountRecoveryUserAlreadyConfirmEmail.name]: () => new HttpErrors.ConflictError(error.message),
    [DomainErrors.ImproveCompetenceEvaluationForbiddenError.name]: () =>
      new HttpErrors.ImproveCompetenceEvaluationForbiddenError(error.message),
    [DomainErrors.ArchivedCampaignError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.CampaignParticipationDeletedError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.AlreadyRatedAssessmentError.name]: () =>
      new HttpErrors.PreconditionFailedError('Assessment is already rated.'),
    [DomainErrors.CompetenceResetError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.NoCampaignParticipationForUserAndCampaign.name]: () =>
      new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.OrganizationLearnerDisabledError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.NoOrganizationToAttach.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.ChallengeAlreadyAnsweredError.name]: () =>
      new HttpErrors.ConflictError('This challenge has already been answered.'),
    [DomainErrors.ChallengeNotAskedError.name]: () =>
      new HttpErrors.ConflictError('This challenge has not been asked to the user.'),
    [DomainErrors.ChallengeToBeNeutralizedNotFoundError.name]: () => new HttpErrors.NotFoundError(error.message),
    [DomainErrors.ChallengeToBeDeneutralizedNotFoundError.name]: () => new HttpErrors.NotFoundError(error.message),
    [DomainErrors.NotFoundError.name]: () => new HttpErrors.NotFoundError(error.message, error.code),
    [DomainErrors.DeletedError.name]: () => new HttpErrors.ConflictError(error.message, error.code),
    [DomainErrors.CampaignCodeError.name]: () => new HttpErrors.NotFoundError(error.message),
    [DomainErrors.UserAlreadyExistsWithAuthenticationMethodError.name]: () =>
      new HttpErrors.ConflictError(error.message),
    [DomainErrors.UserNotAuthorizedToAccessEntityError.name]: () =>
      new HttpErrors.ForbiddenError('Utilisateur non autorisé à accéder à la ressource'),
    [DomainErrors.UserNotAuthorizedToUpdateResourceError.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserNotAuthorizedToCreateCampaignError.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserNotAuthorizedToGetCertificationCoursesError.name]: () =>
      new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserNotAuthorizedToGenerateUsernamePasswordError.name]: () =>
      new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserNotAuthorizedToRemoveAuthenticationMethod.name]: () =>
      new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.CertificationCandidateAlreadyLinkedToUserError.name]: () =>
      new HttpErrors.ForbiddenError('Le candidat de certification est déjà lié à un utilisateur.'),
    [DomainErrors.CertificationCandidateByPersonalInfoNotFoundError.name]: () =>
      new HttpErrors.NotFoundError(
        "Aucun candidat de certification ne correspond aux informations d'identité fournies."
      ),
    [DomainErrors.CertificationCandidateByPersonalInfoTooManyMatchesError.name]: () =>
      new HttpErrors.ConflictError(
        "Plus d'un candidat de certification correspondent aux informations d'identité fournies."
      ),
    [DomainErrors.CertificationCandidatePersonalInfoFieldMissingError.name]: () =>
      new HttpErrors.BadRequestError("Un ou plusieurs champs d'informations d'identité sont manquants."),
    [DomainErrors.NoCertificationAttestationForDivisionError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.CertificationCandidatePersonalInfoWrongFormat.name]: () =>
      new HttpErrors.BadRequestError("Un ou plusieurs champs d'informations d'identité sont au mauvais format."),
    [DomainErrors.CertificationCandidateAddError.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.CertificationCandidatesImportError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message, error.code),
    [DomainErrors.CertificationCandidateForbiddenDeletionError.name]: () =>
      new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.CancelledOrganizationInvitationError.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.SupervisorAccessNotAuthorizedError.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.SendingEmailToRefererError.name]: () => new HttpErrors.ServiceUnavailableError(error.message),
    [DomainErrors.SendingEmailToResultRecipientError.name]: () => new HttpErrors.ServiceUnavailableError(error.message),
    [DomainErrors.CertificationCenterMembershipCreationError.name]: () =>
      new HttpErrors.BadRequestError("Le membre ou le centre de certification n'existe pas."),
    [DomainErrors.InvalidCertificationCandidate.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.InvalidCertificationReportForFinalization.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.InvalidExternalAPIResponseError.name]: () => new HttpErrors.ServiceUnavailableError(error.message),
    [DomainErrors.NoCertificationResultForDivision.name]: () => new HttpErrors.NotFoundError(error.message),
    [DomainErrors.UnexpectedUserAccountError.name]: () =>
      new HttpErrors.ConflictError(error.message, error.code, error.meta),
    [DomainErrors.MissingUserAccountError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.AlreadyExistingEntityError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.AlreadyExistingMembershipError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.AlreadyExistingOrganizationInvitationError.name]: () =>
      new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.AlreadyAcceptedOrCancelledOrganizationInvitationError.name]: () =>
      new HttpErrors.ConflictError(error.message),
    [DomainErrors.AlreadyExistingCampaignParticipationError.name]: () =>
      new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.AlreadySharedCampaignParticipationError.name]: () =>
      new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.UserCantBeCreatedError.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.ForbiddenAccess.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.MembershipCreationError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.MembershipUpdateError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.ObjectValidationError.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.OrganizationNotFoundError.name]: () => new HttpErrors.NotFoundError(error.message),
    [DomainErrors.OrganizationWithoutEmailError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.ManyOrganizationsFoundError.name]: () => new HttpErrors.ConflictError(error.message),
    [DomainErrors.FileValidationError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
    [DomainErrors.OrganizationLearnersCouldNotBeSavedError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.AssessmentNotCompletedError.name]: () => new HttpErrors.ConflictError(error.message),
    [DomainErrors.UserAlreadyLinkedToCandidateInSessionError.name]: () =>
      new HttpErrors.ForbiddenError("L'utilisateur est déjà lié à un candidat dans cette session."),
    [DomainErrors.UserNotAuthorizedToCertifyError.name]: () =>
      new HttpErrors.ForbiddenError('The user cannot be certified.'),
    [DomainErrors.MissingOrInvalidCredentialsError.name]: () =>
      new HttpErrors.UnauthorizedError("L'adresse e-mail et/ou le mot de passe saisis sont incorrects."),
    [DomainErrors.ApplicationWithInvalidClientIdError.name]: () =>
      new HttpErrors.UnauthorizedError('The client ID is invalid.'),
    [DomainErrors.ApplicationWithInvalidClientSecretError.name]: () =>
      new HttpErrors.UnauthorizedError('The client secret is invalid.'),
    [DomainErrors.ApplicationScopeNotAllowedError.name]: () =>
      new HttpErrors.ForbiddenError('The scope is not allowed.'),
    [DomainErrors.UserNotAuthorizedToGetCampaignResultsError.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserNotFoundError.name]: () => new HttpErrors.NotFoundError(error.message),
    [DomainErrors.UserShouldChangePasswordError.name]: () =>
      new HttpErrors.PasswordShouldChangeError(error.message, error.meta),
    [DomainErrors.PasswordResetDemandNotFoundError.name]: () => new HttpErrors.NotFoundError(error.message),
    [DomainErrors.PasswordNotMatching.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.InvalidExternalUserTokenError.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.InvalidResultRecipientTokenError.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.InvalidTemporaryKeyError.name]: () => new HttpErrors.UnauthorizedError(error.message),
    [DomainErrors.AlreadyRegisteredEmailAndUsernameError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.AlreadyRegisteredEmailError.name]: () => new HttpErrors.BadRequestError(error.message, error.code),
    [DomainErrors.AlreadyRegisteredUsernameError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.WrongDateFormatError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.SessionAlreadyFinalizedError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.SessionWithoutStartedCertificationError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.SessionWithAbortReasonOnCompletedCertificationCourseError.name]: () =>
      new HttpErrors.ConflictError(error.message),
    [DomainErrors.SessionStartedDeletionError.name]: () => new HttpErrors.ConflictError(error.message),
    [DomainErrors.OrganizationLearnerAlreadyLinkedToUserError.name]: () =>
      new HttpErrors.ConflictError(error.message, error.code, error.meta),
    [DomainErrors.OrganizationLearnerAlreadyLinkedToInvalidUserError.name]: () =>
      new HttpErrors.BadRequestError(error.message),
    [DomainErrors.MatchingReconciledStudentNotFoundError.name]: () =>
      new HttpErrors.BadRequestError(error.message, error.code),
    [DomainErrors.UserNotAuthorizedToUpdatePasswordError.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserNotAuthorizedToUpdateEmailError.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserNotAuthorizedToCreateResourceError.name]: () => new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.UserOrgaSettingsCreationError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.UserNotMemberOfOrganizationError.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.UserCouldNotBeReconciledError.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.CsvImportError.name]: () =>
      new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta),
    [DomainErrors.SiecleXmlImportError.name]: () =>
      new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta),
    [DomainErrors.TargetProfileInvalidError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.NoStagesForCampaign.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.SessionNotAccessible.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.CampaignTypeError.name]: () => new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.InvalidVerificationCodeError.name]: () => new HttpErrors.ForbiddenError(error.message, error.code),
    [DomainErrors.EmailModificationDemandNotFoundOrExpiredError.name]: () =>
      new HttpErrors.ForbiddenError(error.message, error.code),
    [DomainErrors.TargetProfileCannotBeCreated.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.InvalidPasswordForUpdateEmailError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.InvalidMembershipOrganizationRoleError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.UnexpectedOidcStateError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.InvalidIdentityProviderError.name]: () => new HttpErrors.BadRequestError(error.message),
    [DomainErrors.YamlParsingError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
    [DomainErrors.UnknownCountryForStudentEnrollmentError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
    [DomainErrors.MultipleOrganizationLearnersWithDifferentNationalStudentIdError.name]: () =>
      new HttpErrors.ConflictError(error.message),
    [DomainErrors.CpfBirthInformationValidationError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.CpfBirthInformationValidationError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.UncancellableOrganizationInvitationError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.UserShouldNotBeReconciledOnAnotherAccountError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
    [DomainErrors.AlreadyExistingAdminMemberError.name]: () => new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.CandidateNotAuthorizedToJoinSessionError.name]: () =>
      new HttpErrors.ForbiddenError(error.message, error.code),
    [DomainErrors.CandidateNotAuthorizedToResumeCertificationTestError.name]: () =>
      new HttpErrors.ForbiddenError(error.message, error.code),
    [DomainErrors.CertificationCandidateOnFinalizedSessionError.name]: () =>
      new HttpErrors.ForbiddenError(error.message),
    [DomainErrors.OrganizationLearnerCannotBeDissociatedError.name]: () =>
      new HttpErrors.PreconditionFailedError(error.message),
    [DomainErrors.CertificationEndedByFinalizationError.name]: () => new HttpErrors.ConflictError(error.message),
    [DomainErrors.DifferentExternalIdentifierError.name]: () => new HttpErrors.ConflictError(error.message),
    [DomainErrors.CertificationAttestationGenerationError.name]: () =>
      new HttpErrors.UnprocessableEntityError(error.message),
    [DomainErrors.InvalidJuryLevelError.name]: () => new HttpErrors.BadRequestError(error.message),
  };

  // eslint-disable-next-line no-prototype-builtins
  if (errorsMapping.hasOwnProperty(error.constructor.name)) {
    return errorsMapping[error.constructor.name]();
  }

  return new HttpErrors.BaseHttpError(error.message);
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
