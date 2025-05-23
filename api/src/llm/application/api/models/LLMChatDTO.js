export class LLMChatDTO {
  constructor({ id, inputMaxChars, inputMaxPrompts }) {
    this.id = id;
    this.inputMaxChars = inputMaxChars;
    this.inputMaxPrompts = inputMaxPrompts;
  }
}
