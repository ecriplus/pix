export class Chat {
  constructor({ id, configurationId, currentCountPrompt }) {
    this.id = id;
    this.configurationId = configurationId;
    this.currentCountPrompt = currentCountPrompt;
  }

  toDTO() {
    return {
      id: this.id,
      configurationId: this.configurationId,
      currentCountPrompt: this.currentCountPrompt,
    };
  }
}
