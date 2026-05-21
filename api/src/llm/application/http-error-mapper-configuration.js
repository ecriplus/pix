import { HttpErrors } from '../../shared/application/errors/http-errors.js';
import {
  ChatForbiddenError,
  ChatNotFoundError,
  ConfigurationNotFoundError,
  IncorrectMessagesOrderingError,
  LLMApiError,
  MaxPromptsReachedError,
  NoAttachmentNeededError,
  NoAttachmentNorMessageProvidedError,
  NoUserIdProvidedError,
  PromptAlreadyOngoingError,
  TooLargeMessageInputError,
} from '../domain/errors.js';

export const llmDomainErrorMappingConfiguration = [
  {
    name: ChatNotFoundError.name,
    httpErrorFn: (error) => new HttpErrors.NotFoundError(error.message, error.code, error.meta),
  },
  {
    name: MaxPromptsReachedError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code, error.meta),
  },
  {
    name: ChatForbiddenError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code, error.meta),
  },
  {
    name: PromptAlreadyOngoingError.name,
    httpErrorFn: (error) => new HttpErrors.ConflictError(error.message, error.code, error.meta),
  },
  {
    name: ConfigurationNotFoundError.name,
    httpErrorFn: (error) => new HttpErrors.BadRequestError(error.message, error.code, error.meta),
  },
  {
    name: NoUserIdProvidedError.name,
    httpErrorFn: (error) => new HttpErrors.BadRequestError(error.message, error.code, error.meta),
  },
  {
    name: NoAttachmentNeededError.name,
    httpErrorFn: (error) => new HttpErrors.BadRequestError(error.message, error.code, error.meta),
  },
  {
    name: NoAttachmentNorMessageProvidedError.name,
    httpErrorFn: (error) => new HttpErrors.BadRequestError(error.message, error.code, error.meta),
  },
  {
    name: LLMApiError.name,
    httpErrorFn: (error) => new HttpErrors.ServiceUnavailableError(error.message),
  },
  {
    name: IncorrectMessagesOrderingError.name,
    httpErrorFn: (error) => new HttpErrors.InternalServerError(error.message),
  },
  {
    name: TooLargeMessageInputError.name,
    httpErrorFn: (error) => new HttpErrors.PayloadTooLargeError(error.message, error.code, error.meta),
  },
];
