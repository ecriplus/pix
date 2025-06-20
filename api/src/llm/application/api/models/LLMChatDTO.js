export class LLMChatDTO {
  constructor({ id, attachmentName, inputMaxChars, inputMaxPrompts }) {
    this.id = id;
    this.inputMaxChars = inputMaxChars;
    this.inputMaxPrompts = inputMaxPrompts;
    this.attachmentName = attachmentName;
  }
}
