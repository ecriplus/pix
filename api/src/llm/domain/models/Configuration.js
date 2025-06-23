export class Configuration {
  #id;
  #historySize;
  #inputMaxChars;
  #inputMaxPrompts;
  #attachmentName;
  #attachmentContext;

  constructor({ id, historySize, inputMaxChars, inputMaxPrompts, attachmentName, attachmentContext }) {
    this.#id = id;
    this.#historySize = historySize;
    this.#inputMaxChars = inputMaxChars;
    this.#inputMaxPrompts = inputMaxPrompts;
    this.#attachmentName = attachmentName;
    this.#attachmentContext = attachmentContext;
  }

  get id() {
    return this.#id;
  }

  get historySize() {
    return this.#historySize;
  }

  get inputMaxChars() {
    return this.#inputMaxChars;
  }

  get inputMaxPrompts() {
    return this.hasAttachment ? this.#inputMaxPrompts - 1 : this.#inputMaxPrompts;
  }

  get hasAttachment() {
    return Boolean(this.#attachmentName);
  }

  get attachmentName() {
    return this.#attachmentName;
  }

  get attachmentContext() {
    return this.#attachmentContext;
  }

  toDTO() {
    return {
      id: this.id,
      historySize: this.#historySize,
      inputMaxChars: this.#inputMaxChars,
      inputMaxPrompts: this.#inputMaxPrompts,
      attachmentName: this.#attachmentName,
      attachmentContext: this.#attachmentContext,
    };
  }
}
