export class Chat {
  /**
   * @constructor
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.configurationId
   * @param {Boolean} params.hasAttachmentContextBeenAdded
   * @param {Array<Message>} params.messages
   */
  constructor({ id, configurationId, hasAttachmentContextBeenAdded, messages = [] }) {
    this.id = id;
    this.configurationId = configurationId;
    this.hasAttachmentContextBeenAdded = hasAttachmentContextBeenAdded;
    this.messages = messages;
  }

  /**
   * @param {string|null} message
   * @returns {void}
   */
  addUserMessage(message) {
    if (message) {
      this.messages.push(new Message({ content: message, isFromUser: true }));
    }
  }

  /**
   * @param {string} attachmentName
   * @param {string} attachmentContext
   * @returns {void}
   */
  addAttachmentContextMessages(attachmentName, attachmentContext) {
    if (!this.hasAttachmentContextBeenAdded) {
      const content =
        'Ajoute le fichier fictif "' +
        attachmentName +
        '" à ton contexte. Voici le contenu du fichier :\n' +
        attachmentContext;
      this.messages.push(new Message({ content, isFromUser: true }));
      this.messages.push(
        new Message({ content: 'Le contenu du fichier fictif a été ajouté au contexte.', isFromUser: false }),
      );
      this.hasAttachmentContextBeenAdded = true;
    }
  }

  /**
   * @param {string|null} message
   * @returns {void}
   */
  addLLMMessage(message) {
    if (message) {
      this.messages.push(new Message({ content: message, isFromUser: false }));
    }
  }

  /**
   * @returns {number}
   */
  get currentPromptsCount() {
    return this.messages.filter((message) => message.isFromUser).length;
  }

  /**
   * @returns {Object}
   */
  toDTO() {
    return {
      id: this.id,
      configurationId: this.configurationId,
      hasAttachmentContextBeenAdded: this.hasAttachmentContextBeenAdded,
      messages: this.messages.map((message) => message.toDTO()),
    };
  }
}

export class Message {
  /**
   * @constructor
   * @param {Object} params
   * @param {string} params.content
   * @param {Boolean} params.isFromUser
   */
  constructor({ content, isFromUser }) {
    this.content = content;
    this.isFromUser = isFromUser;
  }

  /**
   * @returns {Object}
   */
  toDTO() {
    return {
      content: this.content,
      isFromUser: this.isFromUser,
    };
  }
}
