export class LLMChatDTO {
  constructor({ id, attachmentName, inputMaxChars, inputMaxPrompts, hasVictoryConditions, context }) {
    this.id = id;
    this.inputMaxChars = inputMaxChars;
    this.inputMaxPrompts = inputMaxPrompts;
    this.attachmentName = attachmentName;
    this.hasVictoryConditions = hasVictoryConditions;
    this.context = context;
  }
}
