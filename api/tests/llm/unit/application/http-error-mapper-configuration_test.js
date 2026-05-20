import { llmDomainErrorMappingConfiguration } from '../../../../src/llm/application/http-error-mapper-configuration.js';
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
} from '../../../../src/llm/domain/errors.js';
import { HttpErrors } from '../../../../src/shared/application/errors/http-errors.js';
import { expect } from '../../../test-helper.js';

describe('Unit | LLM | Application | HttpErrorMapperConfiguration', function () {
  context('when mapping "ChatNotFoundError"', function () {
    it('returns an NotFoundError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === ChatNotFoundError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new ChatNotFoundError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.NotFoundError);
    });
  });

  context('when mapping "MaxPromptsReachedError"', function () {
    it('returns an ForbiddenError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === MaxPromptsReachedError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new MaxPromptsReachedError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.ForbiddenError);
    });
  });

  context('when mapping "ChatForbiddenError"', function () {
    it('returns an ForbiddenError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === ChatForbiddenError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new ChatForbiddenError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.ForbiddenError);
    });
  });

  context('when mapping "PromptAlreadyOngoingError"', function () {
    it('returns an ConflictError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === PromptAlreadyOngoingError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new PromptAlreadyOngoingError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.ConflictError);
    });
  });

  context('when mapping "ConfigurationNotFoundError"', function () {
    it('returns an BadRequestError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === ConfigurationNotFoundError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new ConfigurationNotFoundError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.BadRequestError);
    });
  });

  context('when mapping "NoUserIdProvidedError"', function () {
    it('returns an BadRequestError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === NoUserIdProvidedError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new NoUserIdProvidedError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.BadRequestError);
    });
  });

  context('when mapping "NoAttachmentNeededError"', function () {
    it('returns an BadRequestError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === NoAttachmentNeededError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new NoAttachmentNeededError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.BadRequestError);
    });
  });

  context('when mapping "NoAttachmentNorMessageProvidedError"', function () {
    it('returns an BadRequestError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === NoAttachmentNorMessageProvidedError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new NoAttachmentNorMessageProvidedError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.BadRequestError);
    });
  });

  context('when mapping "LLMApiError"', function () {
    it('returns an ServiceUnavailableError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === LLMApiError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new LLMApiError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.ServiceUnavailableError);
    });
  });

  context('when mapping "IncorrectMessagesOrderingError"', function () {
    it('returns an InternalServerError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === IncorrectMessagesOrderingError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new IncorrectMessagesOrderingError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.InternalServerError);
    });
  });

  context('when mapping "TooLargeMessageInputError"', function () {
    it('returns an PayloadTooLargeError Http Error', function () {
      // given
      const httpErrorMapper = llmDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === TooLargeMessageInputError.name,
      );

      // when
      const error = httpErrorMapper.httpErrorFn(new TooLargeMessageInputError());

      // then
      expect(error).to.be.instanceOf(HttpErrors.PayloadTooLargeError);
    });
  });
});
