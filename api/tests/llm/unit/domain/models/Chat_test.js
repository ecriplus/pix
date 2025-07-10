import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Unit | Domain | Models | Chat', function () {
  describe('#addUserMessage', function () {
    it('should append a message as user message when message has content', function () {
      // given
      const message = 'un message pas vide';
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addUserMessage(message);

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some message',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          notCounted: false,
        },
        {
          content: 'un message pas vide',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: true,
          notCounted: false,
        },
      ]);
    });

    it('should not append anything when message has no content', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addUserMessage('');
      chat.addUserMessage(null);
      chat.addUserMessage();

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some message',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          notCounted: false,
        },
      ]);
    });
  });

  describe('#addLLMMessage', function () {
    it('should append a message as llm message when message has content', function () {
      // given
      const message = 'un message pas vide';
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addLLMMessage(message);

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some message',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          notCounted: false,
        },
        {
          content: 'un message pas vide',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          notCounted: false,
        },
      ]);
    });

    it('should not append anything when message has no content', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addLLMMessage('');
      chat.addLLMMessage(null);
      chat.addLLMMessage();

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some message',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          notCounted: false,
        },
      ]);
    });
  });

  describe('#addAttachmentContextMessages', function () {
    context('when attachment context has not been added yet', function () {
      it('should add two fictional messages, one from the user and the other one from the LLM', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id' }),
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
        const chatDTO = chat.toDTO();
        expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', true);
        expect(chatDTO).to.have.deep.property('messages', [
          {
            content: 'some message',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: true,
            notCounted: false,
          },
          {
            content: 'some answer',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: false,
            notCounted: false,
          },
          {
            content: undefined,
            attachmentName: 'winter_lyrics.txt',
            attachmentContext: undefined,
            isFromUser: true,
            notCounted: false,
          },
          {
            content: undefined,
            attachmentName: 'winter_lyrics.txt',
            attachmentContext: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
            isFromUser: false,
            notCounted: false,
          },
        ]);
      });
    });

    context('when attachment context has already been added', function () {
      it('should do nothing', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id' }),
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
        expect(chat.toDTO()).to.have.deep.property('messages', [
          {
            content: 'some message',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: true,
            notCounted: false,
          },
          {
            content: 'some answer',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: false,
            notCounted: false,
          },
        ]);
      });
    });
  });

  describe('#get currentPromptsCount', function () {
    context('when chat has no messages at all', function () {
      it('should return 0', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id' }),
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });

        // then
        expect(chat).to.have.property('currentPromptsCount', 0);
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

        // then
        expect(chat).to.have.property('currentPromptsCount', 0);
      });
    });

    context('when chat has user messages', function () {
      it('should return the number of counted user messages', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id' }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'message llm 1', isFromUser: false }),
            new Message({ content: 'message user 1', isFromUser: true }),
            new Message({ content: 'message llm 2', isFromUser: false }),
            new Message({ content: 'message user 2', isFromUser: true }),
          ],
        });

        // then
        expect(chat).to.have.property('currentPromptsCount', 2);
      });
    });

    context('when chat has user uncounted messages ', function () {
      it('should return the number of counted user messages', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({
            id: 'some-config-id',
            historySize: 10,
            inputMaxChars: 500,
            inputMaxPrompts: 4,
            attachmentName: 'test.csv',
            attachmentContext: 'le contexte',
          }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'message llm 1', isFromUser: false }),
            new Message({ content: 'message user 1', isFromUser: true }),
            new Message({ content: 'message llm 2', isFromUser: false }),
            new Message({ content: 'message user 2', isFromUser: true, notCounted: true }),
          ],
        });

        // then
        expect(chat).to.have.property('currentPromptsCount', 1);
      });
    });
  });

  describe('#toDTO', function () {
    it('should return the DTO version of the Chat model', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        userId: 123,
        configuration: new Configuration({
          id: 'some-config-id',
          historySize: 10,
          inputMaxChars: 500,
          inputMaxPrompts: 4,
          attachmentName: 'test.csv',
          attachmentContext: 'le contexte',
        }),
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
        userId: 123,
        configuration: {
          id: 'some-config-id',
          historySize: 10,
          inputMaxChars: 500,
          inputMaxPrompts: 4,
          attachmentName: 'test.csv',
          attachmentContext: 'le contexte',
        },
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            content: 'message llm 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: false,
            notCounted: false,
          },
          {
            content: 'message user 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: true,
            notCounted: true,
          },
        ],
      });
    });
  });

  describe('#fromDTO', function () {
    it('should return the DTO version of the Chat model', function () {
      // given
      const dto = {
        id: 'some-chat-id',
        userId: 123,
        configuration: {
          id: 'some-config-id',
          historySize: 10,
          inputMaxChars: 500,
          inputMaxPrompts: 4,
          attachmentName: 'test.csv',
          attachmentContext: 'le contexte',
        },
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            content: 'message llm 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: false,
            notCounted: false,
          },
          {
            content: 'message user 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: true,
            notCounted: true,
          },
        ],
      };

      // when
      const chat = Chat.fromDTO(dto);

      // then
      expect(chat).to.deepEqualInstance(
        new Chat({
          id: 'some-chat-id',
          userId: 123,
          configuration: new Configuration({
            id: 'some-config-id',
            historySize: 10,
            inputMaxChars: 500,
            inputMaxPrompts: 4,
            attachmentName: 'test.csv',
            attachmentContext: 'le contexte',
          }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'message llm 1', isFromUser: false }),
            new Message({ content: 'message user 1', isFromUser: true, notCounted: true }),
          ],
        }),
      );
    });

    context('when DTO does not contain userId', function () {
      it('should extract userId from chatId', function () {
        // given
        const dto = {
          id: '123-456',
          configuration: {},
          hasAttachmentContextBeenAdded: false,
          messages: [],
        };

        // when
        const chat = Chat.fromDTO(dto);

        // then
        expect(chat).to.deepEqualInstance(
          new Chat({
            id: '123-456',
            userId: 123,
            configuration: new Configuration({}),
            hasAttachmentContextBeenAdded: false,
            messages: [],
          }),
        );
      });
    });
  });
});
