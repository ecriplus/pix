export class Chat {
  constructor({ id, configurationId, attachmentName, attachmentContext, messages = [] }) {
    this.id = id;
    this.configurationId = configurationId;
    this.messages = messages;
    this.attachmentName = attachmentName;
    this.attachmentContext = attachmentContext;
  }

  addUserMessage(message) {
    if (message) {
      this.messages.push(new Message({ content: message, isFromUser: true }));
    }
  }

  addLLMMessage(message) {
    if (message) {
      this.messages.push(new Message({ content: message, isFromUser: false }));
    }
  }

  get currentPromptsCount() {
    return this.messages.filter((message) => message.isFromUser).length;
  }

  toDTO() {
    return {
      id: this.id,
      configurationId: this.configurationId,
      attachmentName: this.attachmentName,
      attachmentContext: this.attachmentContext,
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
