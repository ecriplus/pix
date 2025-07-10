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
          attachmentName: 'filename.txt',
          inputMaxChars: 500,
          inputMaxPrompts: 5,
        }),
        hasAttachmentContextBeenAdded: false,
        messages: [
          new Message({ content: 'Salut', isFromUser: true }),
          new Message({ content: 'Bonjour comment puis-je vous aider ?', isFromUser: false }),
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
          { content: 'Salut', attachmentName: undefined, isFromUser: true },
          { content: 'Bonjour comment puis-je vous aider ?', attachmentName: undefined, isFromUser: false },
        ],
      });
    });

    context('when messages contains an attachment not counted', function () {
      it('serializes the attachment with the next message', function () {
        // given
        const chat = new Chat({
          id: '123e4567-e89b-12d3-a456-426614174000',
          configuration: new Configuration({
            attachmentName: 'filename.txt',
            inputMaxChars: 500,
            inputMaxPrompts: 5,
          }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'Salut', isFromUser: true }),
            new Message({ content: 'Bonjour comment puis-je vous aider ?', isFromUser: false }),
            new Message({ attachmentName: 'chien.webp', isFromUser: true, notCounted: true }),
            new Message({
              attachmentName: 'chien.webp',
              attachmentContext: 'c’est une photo d’un ours',
              isFromUser: false,
            }),
            new Message({ content: 'Que contient ce fichier ?', isFromUser: true }),
            new Message({ content: 'Le fichier contient la photo d’un ours', isFromUser: false }),
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
            { content: 'Salut', attachmentName: undefined, isFromUser: true },
            { content: 'Bonjour comment puis-je vous aider ?', attachmentName: undefined, isFromUser: false },
            { content: 'Que contient ce fichier ?', attachmentName: 'chien.webp', isFromUser: true },
            { content: 'Le fichier contient la photo d’un ours', attachmentName: undefined, isFromUser: false },
          ],
        });
      });
    });

    context('when messages contains an attachment counted', function () {
      it('serializes the attachment with the next message', function () {
        // given
        const chat = new Chat({
          id: '123e4567-e89b-12d3-a456-426614174000',
          configuration: new Configuration({
            attachmentName: 'filename.txt',
            inputMaxChars: 500,
            inputMaxPrompts: 5,
          }),
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'Salut', isFromUser: true }),
            new Message({ content: 'Bonjour comment puis-je vous aider ?', isFromUser: false }),
            new Message({ attachmentName: 'chien.webp', isFromUser: true, notCounted: false }),
            new Message({
              attachmentName: 'chien.webp',
              attachmentContext: 'c’est une photo d’un ours',
              isFromUser: false,
            }),
            new Message({ content: 'Que contient ce fichier ?', isFromUser: true }),
            new Message({ content: 'Le fichier contient la photo d’un ours', isFromUser: false }),
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
            { content: 'Salut', attachmentName: undefined, isFromUser: true },
            { content: 'Bonjour comment puis-je vous aider ?', attachmentName: undefined, isFromUser: false },
            { content: undefined, attachmentName: 'chien.webp', isFromUser: true },
            { content: 'Que contient ce fichier ?', attachmentName: undefined, isFromUser: true },
            { content: 'Le fichier contient la photo d’un ours', attachmentName: undefined, isFromUser: false },
          ],
        });
      });
    });
  });
});
