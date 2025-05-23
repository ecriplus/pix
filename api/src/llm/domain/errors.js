import { DomainError } from '../../shared/domain/errors.js';

export class ConfigurationNotFoundError extends DomainError {
  constructor(id) {
    super(`The configuration of id "${id}" does not exist`);
  }
}

export class LLMApiError extends DomainError {
  constructor(errorStr) {
    super(`Something went wrong when reaching the LLM Api : ${errorStr}`);
  }
}

export class ChatNotFoundError extends DomainError {
  constructor(id) {
    super(`The chat of id "${id}" does not exist`);
  }
}

export class TooLargeMessageInputError extends DomainError {
  constructor() {
    super("You've reached the max characters input");
  }
}

export class MaxPromptsReachedError extends DomainError {
  constructor() {
    super("You've reached the max prompts authorized");
  }
}
