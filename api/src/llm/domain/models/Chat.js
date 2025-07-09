import { Configuration } from './Configuration.js';

export class Chat {
  /**
   * @constructor
   * @param {Object} params
   * @param {string} params.id
   * @param {import('./Configuration').Configuration} params.configuration
   * @param {Boolean} params.hasAttachmentContextBeenAdded
   * @param {Array<Message>} params.messages
   */
  constructor({ id, configuration, hasAttachmentContextBeenAdded, messages = [] }) {
    this.id = id;
    this.configuration = configuration;
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
   * @param {boolean} notCounted
   * @returns {void}
   */
  addAttachmentContextMessages(attachmentName, attachmentContext, notCounted) {
    if (!this.hasAttachmentContextBeenAdded) {
      const userContent = `
<system_notification>
  L'utilisateur a téléversé une pièce jointe :
  <attachment_name>
    ${attachmentName}
  </attachment_name>
</system_notification>`;
      this.messages.push(new Message({ content: userContent, isFromUser: true, notCounted }));
      const llmContent = `
<read_attachment_tool>
  Lecture de la pièce jointe, ${attachmentName} :
  <attachment_content>
    ${attachmentContext}
  </attachment_content>
</read_attachment_tool>`;
      this.messages.push(new Message({ content: llmContent, isFromUser: false }));
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
    return this.messages.filter((message) => message.isFromUser && !message.notCounted).length;
  }

  /**
   * @returns {Object}
   */
  toDTO() {
    return {
      id: this.id,
      configuration: this.configuration.toDTO(),
      hasAttachmentContextBeenAdded: this.hasAttachmentContextBeenAdded,
      messages: this.messages.map((message) => message.toDTO()),
    };
  }

  static fromDTO(chatDTO) {
    return new Chat({
      ...chatDTO,
      configuration: Configuration.fromDTO(chatDTO.configuration),
      messages: chatDTO.messages.map((messageDTO) => new Message(messageDTO)),
    });
  }
}

export class Message {
  /**
   * @constructor
   * @param {Object} params
   * @param {string} params.content
   * @param {Boolean} params.isFromUser
   */
  constructor({ content, isFromUser, notCounted }) {
    this.content = content;
    this.isFromUser = isFromUser;
    this.notCounted = !!notCounted;
  }

  /**
   * @returns {Object}
   */
  toDTO() {
    return {
      content: this.content,
      isFromUser: this.isFromUser,
      notCounted: this.notCounted,
    };
  }
}
