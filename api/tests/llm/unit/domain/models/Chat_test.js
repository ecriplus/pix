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
      chat.addUserMessage(message, true);

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some message',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          shouldBeForwardedToLLM: false,
          shouldBeRenderedInPreview: false,
          shouldBeCountedAsAPrompt: false,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
        },
        {
          content: 'un message pas vide',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: true,
          shouldBeForwardedToLLM: true,
          shouldBeRenderedInPreview: true,
          shouldBeCountedAsAPrompt: true,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
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
          shouldBeForwardedToLLM: false,
          shouldBeRenderedInPreview: false,
          shouldBeCountedAsAPrompt: false,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
        },
      ]);
    });

    it('should set shouldBeCountedAsAPrompt at false if shouldBeForwardedToLLM is also false', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [],
      });

      // when
      chat.addUserMessage('some content', false);

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some content',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: true,
          shouldBeForwardedToLLM: false,
          shouldBeRenderedInPreview: true,
          shouldBeCountedAsAPrompt: false,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
        },
      ]);
    });

    it('should set shouldBeCountedAsAPrompt at true if shouldBeForwardedToLLM is also true', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [],
      });

      // when
      chat.addUserMessage('some content', true);

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some content',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: true,
          shouldBeForwardedToLLM: true,
          shouldBeRenderedInPreview: true,
          shouldBeCountedAsAPrompt: true,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
        },
      ]);
    });

    it('should set haveVictoryConditionsBeenFulfilled at true if given as true', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [],
      });

      // when
      chat.addUserMessage('some content', true, true);

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some content',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: true,
          shouldBeForwardedToLLM: true,
          shouldBeRenderedInPreview: true,
          shouldBeCountedAsAPrompt: true,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: true,
        },
      ]);
    });
  });

  describe('#addLLMMessage', function () {
    it('should append a message as llm message when message has content', function () {
      // given
      const chat = new Chat({
        id: 'some-chat-id',
        configuration: new Configuration({ id: 'some-config-id' }),
        hasAttachmentContextBeenAdded: false,
        messages: [new Message({ content: 'some message', isFromUser: false })],
      });

      // when
      chat.addLLMMessage('un message pas vide');

      // then
      expect(chat.toDTO()).to.have.deep.property('messages', [
        {
          content: 'some message',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          shouldBeForwardedToLLM: false,
          shouldBeRenderedInPreview: false,
          shouldBeCountedAsAPrompt: false,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
        },
        {
          content: 'un message pas vide',
          attachmentName: undefined,
          attachmentContext: undefined,
          isFromUser: false,
          shouldBeForwardedToLLM: true,
          shouldBeRenderedInPreview: true,
          shouldBeCountedAsAPrompt: false,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
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
          shouldBeForwardedToLLM: false,
          shouldBeRenderedInPreview: false,
          shouldBeCountedAsAPrompt: false,
          hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
          haveVictoryConditionsBeenFulfilled: undefined,
        },
      ]);
    });
  });

  describe('#addAttachmentContextMessages', function () {
    context('when attachment context has not been added yet', function () {
      context('when attachment is the right one', function () {
        context('when attachment has been submitted along with a message', function () {
          it('should add two fictional messages, one from the user and the other one from the LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: false,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('winter_lyrics.txt', 'some user message along with the attachment');

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', true);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'winter_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: true,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: true,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'winter_lyrics.txt',
                attachmentContext: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                isFromUser: false,
                shouldBeForwardedToLLM: true,
                shouldBeRenderedInPreview: false,
                shouldBeCountedAsAPrompt: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
        });
        context('when attachment has been submitted alone', function () {
          it('should add two fictional messages, one from the user and the other one from the LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: false,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('winter_lyrics.txt', null);

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', true);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'winter_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: true,
                shouldBeForwardedToLLM: true,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: false,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'winter_lyrics.txt',
                attachmentContext: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                isFromUser: false,
                shouldBeForwardedToLLM: true,
                shouldBeRenderedInPreview: false,
                shouldBeCountedAsAPrompt: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
        });
      });

      context('when attachment is the wrong one', function () {
        context('when attachment has been submitted along with a message', function () {
          it('should add a user fictional message and not add any assistant context message, and should not be sent to LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: false,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('summer_lyrics.txt', 'some user message along with the attachment');

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', false);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'summer_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: true,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
        });
        context('when attachment has been submitted alone', function () {
          it('should add a user fictional message and not add any assistant context message, and should not be sent to LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: false,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('summer_lyrics.txt', null);

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', false);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'summer_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: true,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: false,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
        });
      });
    });

    context('when attachment context has already been added', function () {
      context('when attachment is the right one', function () {
        context('when attachment has been submitted along with a message', function () {
          it('should add only one user fictional message without adding an assistant message for context, and the user message should not be sent to LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: true,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('winter_lyrics.txt', 'some user message along with the attachment');

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', true);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'winter_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: true,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
        });
        context('when attachment has been submitted alone', function () {
          it('should add only one user fictional message without adding an assistant message for context, and the user message should not be sent to LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: true,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('winter_lyrics.txt', null);

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', true);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'winter_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: true,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: false,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
        });
      });

      context('when attachment is the wrong one', function () {
        context('when attachment has been submitted along with a message', function () {
          it('should add a user fictional message and not add any assistant context message, and should not be sent to LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: true,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('summer_lyrics.txt', 'some user message along with the attachment');

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', true);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'summer_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: true,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
        });
        context('when attachment has been submitted alone', function () {
          it('should add a user fictional message and not add any assistant context message, and should not be sent to LLM', function () {
            // given
            const chat = new Chat({
              id: 'some-chat-id',
              configuration: new Configuration({
                id: 'some-config-id',
                attachment: {
                  name: 'winter_lyrics.txt',
                  context: "J'étais assise sur une pierre\nDes larmes coulaient sur mon visage",
                },
              }),
              hasAttachmentContextBeenAdded: true,
              messages: [
                new Message({ content: 'some message', isFromUser: true }),
                new Message({ content: 'some answer', isFromUser: false }),
              ],
            });

            // when
            chat.addAttachmentContextMessages('summer_lyrics.txt', null);

            // then
            const chatDTO = chat.toDTO();
            expect(chatDTO).to.have.property('hasAttachmentContextBeenAdded', true);
            expect(chatDTO).to.have.deep.property('messages', [
              {
                content: 'some message',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: 'some answer',
                attachmentName: undefined,
                attachmentContext: undefined,
                isFromUser: false,
                shouldBeCountedAsAPrompt: false,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: false,
                hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
              {
                content: undefined,
                attachmentName: 'summer_lyrics.txt',
                attachmentContext: undefined,
                isFromUser: true,
                shouldBeCountedAsAPrompt: true,
                shouldBeForwardedToLLM: false,
                shouldBeRenderedInPreview: true,
                hasAttachmentBeenSubmittedAlongWithAPrompt: false,
                haveVictoryConditionsBeenFulfilled: undefined,
              },
            ]);
          });
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
          messages: [
            new Message({ content: 'some message', isFromUser: false, shouldBeCountedAsAPrompt: true }),
            new Message({ content: 'some other message', isFromUser: false, shouldBeCountedAsAPrompt: false }),
          ],
        });

        // then
        expect(chat).to.have.property('currentPromptsCount', 0);
      });
    });

    context('when chat has user messages', function () {
      it('should return the number of user messages to count', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id' }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'message llm 1', isFromUser: false, shouldBeCountedAsAPrompt: false }),
            new Message({ content: 'message user 1', isFromUser: true, shouldBeCountedAsAPrompt: true }),
            new Message({ content: 'message llm 2', isFromUser: false, shouldBeCountedAsAPrompt: false }),
            new Message({ content: 'message user 2', isFromUser: true, shouldBeCountedAsAPrompt: true }),
          ],
        });

        // then
        expect(chat).to.have.property('currentPromptsCount', 2);
      });
    });

    context('when chat has user messages that should not be counted', function () {
      it('should return the number of user messages to count', function () {
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
            new Message({ content: 'message llm 1', isFromUser: false, shouldBeCountedAsAPrompt: false }),
            new Message({ content: 'message user 1', isFromUser: true, shouldBeCountedAsAPrompt: true }),
            new Message({ content: 'message llm 2', isFromUser: false, shouldBeCountedAsAPrompt: false }),
            new Message({ content: 'message user 2', isFromUser: true, shouldBeCountedAsAPrompt: false }),
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
      const configurationDTO = Symbol('configurationDTO');
      const chat = new Chat({
        id: 'some-chat-id',
        userId: 123,
        configurationId: 'abc123',
        configuration: new Configuration(configurationDTO),
        hasAttachmentContextBeenAdded: true,
        totalInputTokens: 2_000,
        totalOutputTokens: 5_000,
        messages: [
          new Message({
            content: 'message user 1',
            isFromUser: true,
            shouldBeCountedAsAPrompt: true,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: true,
          }),
          new Message({
            content: 'message llm 1',
            isFromUser: false,
            shouldBeCountedAsAPrompt: false,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
          }),
          new Message({
            attachmentName: 'file.txt',
            isFromUser: true,
            shouldBeCountedAsAPrompt: true,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: false,
            haveVictoryConditionsBeenFulfilled: true,
          }),
          new Message({
            attachmentName: 'file.txt',
            attachmentContext: 'je suis un poulet',
            isFromUser: false,
            shouldBeCountedAsAPrompt: false,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: false,
          }),
        ],
      });

      // when
      const dto = chat.toDTO();

      // then
      expect(dto).to.deep.equal({
        id: 'some-chat-id',
        userId: 123,
        configurationId: 'abc123',
        configuration: configurationDTO,
        hasAttachmentContextBeenAdded: true,
        totalInputTokens: 2_000,
        totalOutputTokens: 5_000,
        messages: [
          {
            content: 'message user 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: true,
            shouldBeCountedAsAPrompt: true,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
            haveVictoryConditionsBeenFulfilled: undefined,
          },
          {
            content: 'message llm 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: false,
            shouldBeCountedAsAPrompt: false,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
            haveVictoryConditionsBeenFulfilled: undefined,
          },
          {
            content: undefined,
            attachmentName: 'file.txt',
            attachmentContext: undefined,
            isFromUser: true,
            shouldBeCountedAsAPrompt: true,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: false,
            haveVictoryConditionsBeenFulfilled: true,
          },
          {
            content: undefined,
            attachmentName: 'file.txt',
            attachmentContext: 'je suis un poulet',
            isFromUser: false,
            shouldBeCountedAsAPrompt: false,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: false,
            hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
            haveVictoryConditionsBeenFulfilled: undefined,
          },
        ],
      });
    });
  });

  describe('#fromDTO', function () {
    it('should return a Chat model', function () {
      // given
      const dto = {
        id: 'some-chat-id',
        userId: 123,
        configurationId: 'abc123',
        configuration: {},
        hasAttachmentContextBeenAdded: true,
        messages: [
          {
            content: 'message user 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: true,
            shouldBeCountedAsAPrompt: true,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
            haveVictoryConditionsBeenFulfilled: undefined,
          },
          {
            content: 'message llm 1',
            attachmentName: undefined,
            attachmentContext: undefined,
            isFromUser: false,
            shouldBeCountedAsAPrompt: false,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
            haveVictoryConditionsBeenFulfilled: undefined,
          },
          {
            content: undefined,
            attachmentName: 'file.txt',
            attachmentContext: undefined,
            isFromUser: true,
            shouldBeCountedAsAPrompt: true,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: false,
            haveVictoryConditionsBeenFulfilled: true,
          },
          {
            content: undefined,
            attachmentName: 'file.txt',
            attachmentContext: 'je suis un poulet',
            isFromUser: false,
            shouldBeCountedAsAPrompt: false,
            shouldBeForwardedToLLM: true,
            shouldBeRenderedInPreview: false,
            hasAttachmentBeenSubmittedAlongWithAPrompt: undefined,
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
          configurationId: 'abc123',
          configuration: new Configuration({}), // Configuration model has no enumerable properties
          hasAttachmentContextBeenAdded: true,
          messages: [
            new Message({
              content: 'message user 1',
              isFromUser: true,
              shouldBeCountedAsAPrompt: true,
              shouldBeForwardedToLLM: true,
              shouldBeRenderedInPreview: true,
            }),
            new Message({
              content: 'message llm 1',
              isFromUser: false,
              shouldBeCountedAsAPrompt: false,
              shouldBeRenderedInPreview: true,
              shouldBeForwardedToLLM: true,
            }),
            new Message({
              attachmentName: 'file.txt',
              isFromUser: true,
              shouldBeCountedAsAPrompt: true,
              shouldBeForwardedToLLM: true,
              shouldBeRenderedInPreview: true,
              hasAttachmentBeenSubmittedAlongWithAPrompt: false,
              haveVictoryConditionsBeenFulfilled: true,
            }),
            new Message({
              attachmentName: 'file.txt',
              attachmentContext: 'je suis un poulet',
              isFromUser: false,
              shouldBeCountedAsAPrompt: false,
              shouldBeForwardedToLLM: true,
              shouldBeRenderedInPreview: false,
            }),
          ],
        }),
      );
    });
  });

  describe('#isAttachmentValid', function () {
    context('when configuration has no attachment', function () {
      it('returns false', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id' }),
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });

        // when
        const isAttachmentValid = chat.isAttachmentValid('myAttachmentName.pdf');

        // then
        expect(isAttachmentValid).to.be.false;
      });
    });

    context('when configuration has an attachment', function () {
      let chat;
      beforeEach(function () {
        chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id', attachment: { name: 'Le plan de ma maison.txt' } }),
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });
      });

      context('success cases', function () {
        it('returns true when attachment name and extension is strictly identical', function () {
          // when
          const isAttachmentValid = chat.isAttachmentValid('Le plan de ma maison.txt');

          // then
          expect(isAttachmentValid).to.be.true;
        });

        it('returns true when attachment name has a prefix, but still contains the original expected name, and extension is identical', function () {
          // when
          const isAttachmentValid = chat.isAttachmentValid('(1) Le plan de ma maison.txt');

          // then
          expect(isAttachmentValid).to.be.true;
        });

        it('returns true when attachment name has a suffix, but still contains the original expected name, and extension is identical', function () {
          // when
          const isAttachmentValid = chat.isAttachmentValid('Le plan de ma maison COPIE(2).txt');

          // then
          expect(isAttachmentValid).to.be.true;
        });

        it('returns true when attachment name has both a suffix and a prefix, but still contains the original expected name, and extension is identical', function () {
          // when
          const isAttachmentValid = chat.isAttachmentValid('1_ Le plan de ma maison COPIE(2).txt');

          // then
          expect(isAttachmentValid).to.be.true;
        });
      });

      context('fail cases', function () {
        it('returns false when attachment name is OK but extension is wrong', function () {
          // when
          const isAttachmentValid = chat.isAttachmentValid('Le plan de ma maison.jpeg');

          // then
          expect(isAttachmentValid).to.be.false;
        });
        it('returns false when extension is ok but attachment name is wrong', function () {
          // when
          const isAttachmentValid = chat.isAttachmentValid('Le plan de mon jardin.txt');

          // then
          expect(isAttachmentValid).to.be.false;
        });
        it('returns false when extension is ok but attachment name is wrong, even if it contains all of the original name', function () {
          // when
          const isAttachmentValid = chat.isAttachmentValid('Le plan (COPIE)1 de ma maison.txt');

          // then
          expect(isAttachmentValid).to.be.false;
        });
      });
    });
  });

  describe('#get messagesToForwardToLLM', function () {
    context('when chat has no messages at all', function () {
      it('should return an empty array', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id', llm: { historySize: 45 } }),
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });

        // then
        expect(chat.messagesToForwardToLLM).to.deep.equal([]);
      });
    });
    context('history size', function () {
      it('returns the N latest messages according to configuration history size', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({ id: 'some-config-id', llm: { historySize: 4 } }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'first message', isFromUser: true, shouldBeForwardedToLLM: true }),
            new Message({ content: 'second message', isFromUser: false, shouldBeForwardedToLLM: true }),
            new Message({ content: 'third message', isFromUser: true, shouldBeForwardedToLLM: true }),
            new Message({ content: 'fourth message', isFromUser: false, shouldBeForwardedToLLM: true }),
            new Message({ content: 'fifth message', isFromUser: true, shouldBeForwardedToLLM: true }),
            new Message({ content: 'sixth message', isFromUser: false, shouldBeForwardedToLLM: true }),
          ],
        });

        // then
        expect(chat.messagesToForwardToLLM).to.deep.equal([
          {
            content: 'third message',
            role: 'user',
          },
          {
            content: 'fourth message',
            role: 'assistant',
          },
          {
            content: 'fifth message',
            role: 'user',
          },
          {
            content: 'sixth message',
            role: 'assistant',
          },
        ]);
      });
    });
    context('attachments', function () {
      it('returns well formatted attachment messages', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({
            id: 'some-config-id',
            llm: { historySize: 4 },
            attachment: { name: 'file.txt', context: "Ceci n'est pas une pipe." },
          }),
          hasAttachmentContextBeenAdded: true,
          messages: [
            new Message({ attachmentName: 'file.txt', isFromUser: true, shouldBeForwardedToLLM: true }),
            new Message({
              attachmentName: 'file.txt',
              attachmentContext: "Ceci n'est pas une pipe.",
              isFromUser: false,
              shouldBeForwardedToLLM: true,
            }),
            new Message({
              content: 'Quel instrument pour fumer est mentionné dans mon fichier ?',
              isFromUser: true,
              shouldBeForwardedToLLM: true,
            }),
          ],
        });

        // then
        expect(chat.messagesToForwardToLLM).to.deep.equal([
          {
            content:
              "<system_notification>L'utilisateur a téléversé une pièce jointe : <attachment_name>file.txt</attachment_name></system_notification>",
            role: 'user',
          },
          {
            content:
              "<read_attachment_tool>Lecture de la pièce jointe, file.txt : <attachment_content>Ceci n'est pas une pipe.</attachment_content></read_attachment_tool>",
            role: 'assistant',
          },
          {
            content: 'Quel instrument pour fumer est mentionné dans mon fichier ?',
            role: 'user',
          },
        ]);
      });
    });
    context('messages not to forward', function () {
      it('returns messages except the ones to not forward', function () {
        // given
        const chat = new Chat({
          id: 'some-chat-id',
          configuration: new Configuration({
            id: 'some-config-id',
            llm: { historySize: 4 },
            attachment: { name: 'file.txt', context: "Ceci n'est pas une pipe." },
          }),
          hasAttachmentContextBeenAdded: true,
          messages: [
            new Message({ content: 'message user 1', isFromUser: true, shouldBeForwardedToLLM: true }),
            new Message({ content: 'message assistant 1', isFromUser: false, shouldBeForwardedToLLM: true }),
            new Message({ content: 'message user à ignorer', isFromUser: true, shouldBeForwardedToLLM: false }),
          ],
        });

        // then
        expect(chat.messagesToForwardToLLM).to.deep.equal([
          {
            content: 'message user 1',
            role: 'user',
          },
          {
            content: 'message assistant 1',
            role: 'assistant',
          },
        ]);
      });
    });
  });
});
