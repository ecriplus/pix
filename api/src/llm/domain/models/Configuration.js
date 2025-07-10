export class Configuration {
  #id;
  #historySize;
  #inputMaxChars;
  #inputMaxPrompts;
  #attachmentName;
  #attachmentContext;

  /**
   * @constructor
   * @param {Object} params
   * @param {string} params.id
   * @param {number} params.historySize
   * @param {number} params.inputMaxChars
   * @param {number} params.inputMaxPrompts
   * @param {string|null} params.attachmentName
   * @param {string|null} params.attachmentContext
   */
  constructor({ id, historySize, inputMaxChars, inputMaxPrompts, attachmentName, attachmentContext }) {
    this.#id = id;
    this.#historySize = historySize;
    this.#inputMaxChars = inputMaxChars;
    this.#inputMaxPrompts = inputMaxPrompts;
    this.#attachmentName = attachmentName;
    this.#attachmentContext = attachmentContext;
  }

  /**
   * @returns {string}
   */
  get id() {
    return this.#id;
  }

  /**
   * @returns {number}
   */
  get historySize() {
    return this.#historySize;
  }

  /**
   * @returns {number}
   */
  get inputMaxChars() {
    return this.#inputMaxChars;
  }

  /**
   * @returns {number}
   */
  get inputMaxPrompts() {
    return this.hasAttachment ? this.#inputMaxPrompts - 1 : this.#inputMaxPrompts;
  }

  /**
   * @returns {Boolean}
   */
  get hasAttachment() {
    return Boolean(this.#attachmentName);
  }

  /**
   * @returns {string|null}
   */
  get attachmentName() {
    return this.#attachmentName;
  }

  /**
   * @returns {string|null}
   */
  get attachmentContext() {
    return this.#attachmentContext;
  }

  /**
   * @returns {Object}
   */
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

  static fromDTO(configurationDTO) {
    return new Configuration(configurationDTO);
  }
}
