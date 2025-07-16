export class Configuration {
  /** @type {ConfigurationDTO} */
  #dto;

  /**
   * @param {ConfigurationDTO} configurationDTO
   */
  constructor(configurationDTO) {
    this.#dto = configurationDTO;
  }

  get historySize() {
    return this.#dto.llm.historySize;
  }

  get inputMaxChars() {
    return this.#dto.challenge.inputMaxChars;
  }

  get inputMaxPrompts() {
    return this.hasAttachment ? this.#dto.challenge.inputMaxPrompts - 1 : this.#dto.challenge.inputMaxPrompts;
  }

  get hasAttachment() {
    return this.#dto.attachment != undefined;
  }

  get attachmentName() {
    return this.#dto.attachment?.name;
  }

  get attachmentContext() {
    return this.#dto.attachment?.context;
  }

  toDTO() {
    return this.#dto;
  }

  /**
   * @param {ConfigurationDTO} configurationDTO
   */
  static fromDTO(configurationDTO) {
    return new Configuration(configurationDTO);
  }
}

/**
 * @typedef {object} ConfigurationDTO
 * @property {object} llm
 * @property {string} llm.model
 * @property {string} llm.environment
 * @property {number} llm.historySize
 * @property {number} llm.temperature
 * @property {number} llm.outputMaxToken
 * @property {string} llm.moderationModel
 * @property {string} name
 * @property {object} challenge
 * @property {string[]} challenge.tools
 * @property {string} challenge.description
 * @property {string} challenge.systemPrompt
 * @property {number} challenge.inputMaxChars
 * @property {number} challenge.inputMaxPrompts
 * @property {object} challenge.victoryConditions FIXME add victoryConditions properties
 * @property {Attachment=} attachment
 */

/**
 * @typedef {object} Attachment
 * @property {string} name
 * @property {string} context
 */
