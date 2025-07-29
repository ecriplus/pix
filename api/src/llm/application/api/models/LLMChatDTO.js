export class LLMChatDTO {
  constructor({ id, attachmentName, inputMaxChars, inputMaxPrompts, context }) {
    this.id = id;
    this.inputMaxChars = inputMaxChars;
    this.inputMaxPrompts = inputMaxPrompts;
    this.attachmentName = attachmentName;
    this.context = context;
  }
}
