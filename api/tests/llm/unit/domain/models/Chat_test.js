import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Unit | Domain | Models | Chat', function () {
  describe('#addUserMessage', function () {
    it('should append a message as user message when message has content', function () {
      // given
      const message = 'un message pas vide';
      const chat = new Chat({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addUserMessage(message);

      // then
      expect(chat.toDTO()).to.deep.equal({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            content: 'some message',
            isFromUser: false,
            notCounted: false,
          },
          {
            content: 'un message pas vide',
            isFromUser: true,
            notCounted: false,
          },
        ],
      });
    });

    it('should not append anything when message has no content', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addUserMessage('');
      chat.addUserMessage(null);
      chat.addUserMessage();

      // then
      expect(chat.toDTO()).to.deep.equal({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            content: 'some message',
            isFromUser: false,
            notCounted: false,
          },
        ],
      });
    });
  });

  describe('#addLLMMessage', function () {
    it('should append a message as llm message when message has content', function () {
      // given
      const message = 'un message pas vide';
      const chat = new Chat({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addLLMMessage(message);

      // then
      expect(chat.toDTO()).to.deep.equal({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            content: 'some message',
            isFromUser: false,
            notCounted: false,
          },
          {
            content: 'un message pas vide',
            isFromUser: false,
            notCounted: false,
          },
        ],
      });
    });

    it('should not append anything when message has no content', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addLLMMessage('');
      chat.addLLMMessage(null);
      chat.addLLMMessage();

      // then
      expect(chat.toDTO()).to.deep.equal({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            content: 'some message',
            isFromUser: false,
            notCounted: false,
          },
        ],
      });
    });
  });

  describe('#addAttachmentContextMessages', function () {
    context('when attachment context has not been added yet', function () {
      it('should add two fictional messages, one from the user and the other one from the LLM', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'some message', isFromUser: true }),
            new Message({ content: 'some answer', isFromUser: false }),
          ],
        });

        // when
        chat.addAttachmentContextMessages(
          'winter_lyrics.txt',
          "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
        );

        // then
        expect(chat.toDTO()).to.deep.equal({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: true,
          messages: [
            {
              content: 'some message',
              isFromUser: true,
              notCounted: false,
            },
            {
              content: 'some answer',
              isFromUser: false,
              notCounted: false,
            },
            {
              content:
                "\n<system_notification>\n  L'utilisateur a téléversé une pièce jointe :\n  <attachment_name>\n    winter_lyrics.txt\n  </attachment_name>\n</system_notification>",
              isFromUser: true,
              notCounted: false,
            },
            {
              content:
                "\n<read_attachment_tool>\n  Lecture de la pièce jointe, winter_lyrics.txt :\n  <attachment_content>\n    J'étais assise sur une pierre\nDes larmes coulaient sur mon visage\n  </attachment_content>\n</read_attachment_tool>",
              isFromUser: false,
              notCounted: false,
            },
          ],
        });
      });
    });

    context('when attachment context has not already been added', function () {
      it('should do nothing', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: true,
          messages: [
            new Message({ content: 'some message', isFromUser: true }),
            new Message({ content: 'some answer', isFromUser: false }),
          ],
        });

        // when
        chat.addAttachmentContextMessages(
          'winter_lyrics.txt',
          "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
        );

        // then
        expect(chat.toDTO()).to.deep.equal({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: true,
          messages: [
            {
              content: 'some message',
              isFromUser: true,
              notCounted: false,
            },
            {
              content: 'some answer',
              isFromUser: false,
              notCounted: false,
            },
          ],
        });
      });
    });
  });

  describe('#get currentPromptsCount', function () {
    context('when chat has no messages at all', function () {
      it('should return 0', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });

        // when
        const currentPromptsCount = chat.currentPromptsCount;

        // then
        expect(currentPromptsCount).to.equal(0);
      });
    });

    context('when chat has no user messages', function () {
      it('should return 0', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: false,
          messages: [new Message({ content: 'some message', isFromUser: false })],
        });

        // when
        const currentPromptsCount = chat.currentPromptsCount;

        // then
        expect(currentPromptsCount).to.equal(0);
      });
    });

    context('when chat has user messages', function () {
      it('should return the number of counted user messages', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'message llm 1', isFromUser: false }),
            new Message({ content: 'message user 1', isFromUser: true }),
            new Message({ content: 'message llm 2', isFromUser: false }),
            new Message({ content: 'message user 2', isFromUser: true }),
          ],
        });

        // when
        const currentPromptsCount = chat.currentPromptsCount;

        // then
        expect(currentPromptsCount).to.equal(2);
      });
    });

    context('when chat has user uncounted messages ', function () {
      it('should return the number of counted user messages', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configurationId: 'some-config-id',
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'message llm 1', isFromUser: false }),
            new Message({ content: 'message user 1', isFromUser: true }),
            new Message({ content: 'message llm 2', isFromUser: false }),
            new Message({ content: 'message user 2', isFromUser: true, notCounted: true }),
          ],
        });

        // when
        const currentPromptsCount = chat.currentPromptsCount;

        // then
        expect(currentPromptsCount).to.equal(1);
      });
    });
  });

  describe('#toDTO', function () {
    it('should return the DTO version of the Chat model', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [
          new Message({ content: 'message llm 1', isFromUser: false }),
          new Message({ content: 'message user 1', isFromUser: true, notCounted: true }),
        ],
      });

      // when
      const dto = chat.toDTO();

      // then
      expect(dto).to.deep.equal({
        id: 'some-chat-id',
        configurationId: 'some-config-id',
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            content: 'message llm 1',
            isFromUser: false,
            notCounted: false,
          },
          {
            content: 'message user 1',
            isFromUser: true,
            notCounted: true,
          },
        ],
      });
    });
  });
});
