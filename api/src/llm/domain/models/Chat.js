export class Chat {
  constructor({ id, configurationId, historySize, inputMaxChars, inputMaxPrompts }) {
    this.id = id;
    this.configurationId = configurationId;
    this.historySize = historySize;
    this.inputMaxChars = inputMaxChars;
    this.inputMaxPrompts = inputMaxPrompts;
  }

  toDTO() {
    return {
      id: this.id,
      configurationId: this.configurationId,
      historySize: this.historySize,
      inputMaxChars: this.inputMaxChars,
      inputMaxPrompts: this.inputMaxPrompts,
    };
  }
}
