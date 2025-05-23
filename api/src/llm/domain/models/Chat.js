export class Chat {
  constructor({ id, configurationId, messages = [] }) {
    this.id = id;
    this.configurationId = configurationId;
    this.messages = messages;
  }

  addUserMessage(message) {
    this.messages.push(new Message({ content: message, isFromUser: true }));
  }

  addLLMMessage(message) {
    this.messages.push(new Message({ content: message, isFromUser: false }));
  }

  get latestLLMMessage() {
    const lastLLMMessage = this.messages.findLast((message) => !message.isFromUser);
    return lastLLMMessage?.content ?? null;
  }

  get currentPromptsCount() {
    return this.messages.filter((message) => message.isFromUser).length;
  }

  toDTO() {
    return {
      id: this.id,
      configurationId: this.configurationId,
      messages: this.messages.map((message) => message.toDTO()),
    };
  }
}

export class Message {
  constructor({ content, isFromUser }) {
    this.content = content;
    this.isFromUser = isFromUser;
  }

  toDTO() {
    return {
      content: this.content,
      isFromUser: this.isFromUser,
    };
  }
}
