import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { serialize } from '../../../../../src/llm/infrastructure/serializers/json/chat-serializer.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Unit | Infrastructure | Serializers | Chat', function () {
  describe('serialize', function () {
    it('serializes Chat', function () {
      // given
      const chat = new Chat({
        id: '123e4567-e89b-12d3-a456-426614174000',
        configuration: new Configuration({
          challenge: {
            inputMaxChars: 500,
            inputMaxPrompts: 5,
          },
          attachment: {
            name: 'filename.txt',
          },
        }),
        hasAttachmentContextBeenAdded: false,
        messages: [
          new Message({ content: 'Salut', isFromUser: true, shouldBeRenderedInPreview: true }),
          new Message({
            content: 'Bonjour comment puis-je vous aider ?',
            isFromUser: false,
            shouldBeRenderedInPreview: true,
          }),
        ],
      });

      // when
      const payload = serialize(chat);

      // then
      expect(payload).to.deep.equal({
        id: '123e4567-e89b-12d3-a456-426614174000',
        attachmentName: 'filename.txt',
        inputMaxChars: 500,
        inputMaxPrompts: 4,
        messages: [
          { content: 'Salut', attachmentName: undefined, isFromUser: true, isAttachmentValid: false },
          {
            content: 'Bonjour comment puis-je vous aider ?',
            attachmentName: undefined,
            isFromUser: false,
            isAttachmentValid: false,
          },
        ],
      });
    });

    context('when some messages should not be serialized to preview', function () {
      it('serializes Chat without those messages', function () {
        // given
        const chat = new Chat({
          id: '123e4567-e89b-12d3-a456-426614174000',
          configuration: new Configuration({
            challenge: {
              inputMaxChars: 500,
              inputMaxPrompts: 5,
            },
            attachment: {
              name: 'filename.txt',
            },
          }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'Salut', isFromUser: true, shouldBeRenderedInPreview: false }),
            new Message({
              content: 'Bonjour comment puis-je vous aider ?',
              isFromUser: false,
              shouldBeRenderedInPreview: true,
            }),
          ],
        });

        // when
        const payload = serialize(chat);

        // then
        expect(payload).to.deep.equal({
          id: '123e4567-e89b-12d3-a456-426614174000',
          attachmentName: 'filename.txt',
          inputMaxChars: 500,
          inputMaxPrompts: 4,
          messages: [
            {
              content: 'Bonjour comment puis-je vous aider ?',
              attachmentName: undefined,
              isFromUser: false,
              isAttachmentValid: false,
            },
          ],
        });
      });
    });

    context('when there are "attachment" messages that were sent along with a prompt', function () {
      it('serializes the attachments messages merged with the message that was sent along (should be the next one is the list)', function () {
        // given
        const chat = new Chat({
          id: '123e4567-e89b-12d3-a456-426614174000',
          configuration: new Configuration({
            challenge: {
              inputMaxChars: 500,
              inputMaxPrompts: 5,
            },
            attachment: {
              name: 'chien.webp',
            },
          }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'Salut', isFromUser: true, shouldBeRenderedInPreview: true }),
            new Message({
              content: 'Bonjour comment puis-je vous aider ?',
              isFromUser: false,
              shouldBeRenderedInPreview: true,
            }),
            new Message({
              attachmentName: 'chien.webp',
              isFromUser: true,
              shouldBeRenderedInPreview: true,
              hasAttachmentBeenSubmittedAlongWithAPrompt: true,
            }),
            new Message({
              content: 'i should not be serialized',
              shouldBeRenderedInPreview: false,
            }),
            new Message({ content: 'Que contient ce fichier ?', isFromUser: true, shouldBeRenderedInPreview: true }),
            new Message({
              content: 'Le fichier contient la photo d’un ours',
              isFromUser: false,
              shouldBeRenderedInPreview: true,
            }),
            new Message({
              attachmentName: 'chat.webp',
              isFromUser: true,
              shouldBeRenderedInPreview: true,
              hasAttachmentBeenSubmittedAlongWithAPrompt: true,
            }),
            new Message({
              content: 'tu veux bien lire ce fichier avec un chat dedans ?',
              isFromUser: true,
              shouldBeRenderedInPreview: true,
            }),
          ],
        });

        // when
        const payload = serialize(chat);

        // then
        expect(payload).to.deep.equal({
          id: '123e4567-e89b-12d3-a456-426614174000',
          attachmentName: 'chien.webp',
          inputMaxChars: 500,
          inputMaxPrompts: 4,
          messages: [
            { content: 'Salut', attachmentName: undefined, isFromUser: true, isAttachmentValid: false },
            {
              content: 'Bonjour comment puis-je vous aider ?',
              attachmentName: undefined,
              isFromUser: false,
              isAttachmentValid: false,
            },
            {
              content: 'Que contient ce fichier ?',
              attachmentName: 'chien.webp',
              isFromUser: true,
              isAttachmentValid: true,
            },
            {
              content: 'Le fichier contient la photo d’un ours',
              attachmentName: undefined,
              isFromUser: false,
              isAttachmentValid: false,
            },
            {
              content: 'tu veux bien lire ce fichier avec un chat dedans ?',
              attachmentName: 'chat.webp',
              isFromUser: true,
              isAttachmentValid: false,
            },
          ],
        });
      });
    });

    context('when there are "attachment" messages that were sent alone', function () {
      it('serializes the attachments messages as a standalone message', function () {
        // given
        const chat = new Chat({
          id: '123e4567-e89b-12d3-a456-426614174000',
          configuration: new Configuration({
            challenge: {
              inputMaxChars: 500,
              inputMaxPrompts: 5,
            },
            attachment: {
              name: 'chien.webp',
            },
          }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'Salut', isFromUser: true, shouldBeRenderedInPreview: true }),
            new Message({
              content: 'Bonjour comment puis-je vous aider ?',
              isFromUser: false,
              shouldBeRenderedInPreview: true,
            }),
            new Message({
              attachmentName: 'chien.webp',
              isFromUser: true,
              shouldBeRenderedInPreview: true,
              hasAttachmentBeenSubmittedAlongWithAPrompt: false,
            }),
            new Message({
              content: 'i should not be serialized',
              shouldBeRenderedInPreview: false,
            }),
            new Message({ content: 'Que contient ce fichier ?', isFromUser: true, shouldBeRenderedInPreview: true }),
            new Message({
              content: 'Le fichier contient la photo d’un ours',
              isFromUser: false,
              shouldBeRenderedInPreview: true,
            }),
            new Message({
              attachmentName: 'chat.webp',
              isFromUser: true,
              shouldBeRenderedInPreview: true,
              hasAttachmentBeenSubmittedAlongWithAPrompt: false,
            }),
            new Message({
              content: 'tu veux bien lire ce fichier avec un chat dedans ?',
              isFromUser: true,
              shouldBeRenderedInPreview: true,
            }),
          ],
        });

        // when
        const payload = serialize(chat);

        // then
        expect(payload).to.deep.equal({
          id: '123e4567-e89b-12d3-a456-426614174000',
          attachmentName: 'chien.webp',
          inputMaxChars: 500,
          inputMaxPrompts: 4,
          messages: [
            { content: 'Salut', attachmentName: undefined, isFromUser: true, isAttachmentValid: false },
            {
              content: 'Bonjour comment puis-je vous aider ?',
              attachmentName: undefined,
              isFromUser: false,
              isAttachmentValid: false,
            },
            {
              content: undefined,
              attachmentName: 'chien.webp',
              isFromUser: true,
              isAttachmentValid: true,
            },
            {
              content: 'Que contient ce fichier ?',
              attachmentName: undefined,
              isFromUser: true,
              isAttachmentValid: false,
            },
            {
              content: 'Le fichier contient la photo d’un ours',
              attachmentName: undefined,
              isFromUser: false,
              isAttachmentValid: false,
            },
            {
              content: undefined,
              attachmentName: 'chat.webp',
              isFromUser: true,
              isAttachmentValid: false,
            },
            {
              content: 'tu veux bien lire ce fichier avec un chat dedans ?',
              attachmentName: undefined,
              isFromUser: true,
              isAttachmentValid: false,
            },
          ],
        });
      });
    });
  });
});
