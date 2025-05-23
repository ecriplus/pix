export class LLMChat {
  constructor({ id, llmConfigurationId, historySize, inputMaxChars, inputMaxPrompts }) {
    this.id = id;
    this.llmConfigurationId = llmConfigurationId;
    this.historySize = historySize;
    this.inputMaxChars = inputMaxChars;
    this.inputMaxPrompts = inputMaxPrompts;
  }

  toDTO() {
    return {
      id: this.id,
      llmConfigurationId: this.llmConfigurationId,
      historySize: this.historySize,
      inputMaxChars: this.inputMaxChars,
      inputMaxPrompts: this.inputMaxPrompts,
    };
  }
}
