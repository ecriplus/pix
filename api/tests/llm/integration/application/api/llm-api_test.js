import { Readable } from 'node:stream';

import ms from 'ms';

import { prompt, startChat } from '../../../../../src/llm/application/api/llm-api.js';
import {
  ChatForbiddenError,
  ChatNotFoundError,
  ConfigurationNotFoundError,
  MaxPromptsReachedError,
  NoAttachmentNeededError,
  NoAttachmentNorMessageProvidedError,
  NoUserIdProvidedError,
  TooLargeMessageInputError,
} from '../../../../../src/llm/domain/errors.js';
import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { CHAT_STORAGE_PREFIX } from '../../../../../src/llm/infrastructure/repositories/chat-repository.js';
import { CONFIGURATION_STORAGE_PREFIX } from '../../../../../src/llm/infrastructure/repositories/configuration-repository.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { catchErr, expect, nock, sinon } from '../../../../test-helper.js';

const chatTemporaryStorage = temporaryStorage.withPrefix(CHAT_STORAGE_PREFIX);
const configurationTemporaryStorage = temporaryStorage.withPrefix(CONFIGURATION_STORAGE_PREFIX);

describe('LLM | Integration | Application | API | llm', function () {
  afterEach(async function () {
    await chatTemporaryStorage.flushAll();
    await configurationTemporaryStorage.flushAll();
  });

  describe('#startChat', function () {
    let clock, now;

    beforeEach(async function () {
      now = new Date('2023-10-05T18:02:00Z');
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
    });

    afterEach(async function () {
      clock.restore();
    });

    context('when no config id provided', function () {
      it('should throw a ConfigurationNotFoundError', async function () {
        // when
        const err = await catchErr(startChat)({ configId: null, userId: 12345 });

        // then
        expect(err).to.be.instanceOf(ConfigurationNotFoundError);
        expect(err.message).to.equal('The configuration of id "null id provided" does not exist');
      });
    });

    context('when no user id provided', function () {
      it('should throw a NoUserIdProvidedError', async function () {
        // when
        const err = await catchErr(startChat)({ configId: 'someConfig', userId: null });

        // then
        expect(err).to.be.instanceOf(NoUserIdProvidedError);
        expect(err.message).to.equal('Must provide a user ID to use LLM API');
      });
    });

    context('when config id and user id provided', function () {
      let configId, userId, llmApiScope, config;

      context('when config has an attachment', function () {
        beforeEach(function () {
          configId = 'uneConfigQuiExist';
          userId = 123456;
          config = {
            llm: {
              historySize: 123,
            },
            challenge: {
              inputMaxChars: 456,
              inputMaxPrompts: 789,
            },
            attachment: {
              name: 'file.txt',
              context: '**coucou**',
            },
          };
          llmApiScope = nock('https://llm-test.pix.fr/api').get('/configurations/uneConfigQuiExist').reply(200, config);
        });

        it('should return the newly created chat with attachment info, diminushing inputMaxPrompts by one', async function () {
          // when
          const chat = await startChat({ configId, userId });

          // then
          expect(chat).to.deep.equal({
            id: `123456-${now.getMilliseconds()}`,
            attachmentName: 'file.txt',
            inputMaxChars: 456,
            inputMaxPrompts: 788,
          });
          expect(llmApiScope.isDone()).to.be.true;
          expect(await chatTemporaryStorage.get(`123456-${now.getMilliseconds()}`)).to.deep.equal({
            id: `123456-${now.getMilliseconds()}`,
            configurationId: 'uneConfigQuiExist',
            hasAttachmentContextBeenAdded: false,
            messages: [],
          });
        });
      });

      context('when config has no attachment', function () {
        beforeEach(function () {
          configId = 'uneConfigQuiExist';
          userId = 123456;
          config = {
            llm: {
              historySize: 123,
            },
            challenge: {
              inputMaxChars: 456,
              inputMaxPrompts: 789,
            },
          };
          llmApiScope = nock('https://llm-test.pix.fr/api').get('/configurations/uneConfigQuiExist').reply(200, config);
        });

        it('should return the newly created chat with attachment info', async function () {
          // when
          const chat = await startChat({ configId, userId });

          // then
          expect(chat).to.deep.equal({
            id: `123456-${now.getMilliseconds()}`,
            attachmentName: null,
            inputMaxChars: 456,
            inputMaxPrompts: 789,
          });
          expect(llmApiScope.isDone()).to.be.true;
          expect(await chatTemporaryStorage.get(`123456-${now.getMilliseconds()}`)).to.deep.equal({
            id: `123456-${now.getMilliseconds()}`,
            configurationId: 'uneConfigQuiExist',
            hasAttachmentContextBeenAdded: false,
            messages: [],
          });
        });
      });
    });
  });

  describe('#prompt', function () {
    context('when no chat id provided', function () {
      it('should throw a ChatNotFoundError', async function () {
        // given
        const chatId = null;

        // when
        const err = await catchErr(prompt)({ chatId, message: 'un message', userId: 12345 });

        // then
        expect(err).to.be.instanceOf(ChatNotFoundError);
        expect(err.message).to.equal('The chat of id "null id provided" does not exist');
      });
    });

    context('when no user id provided', function () {
      it('should throw a ChatForbiddenError', async function () {
        // given
        const chat = new Chat({
          id: 'chatId',
          configurationId: 'uneConfigQuiExist',
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });
        await chatTemporaryStorage.save({
          key: 'chatId',
          value: chat.toDTO(),
          expirationDelaySeconds: ms('24h'),
        });

        // when
        const err = await catchErr(prompt)({ chatId: 'chatId', userId: null, message: 'un message' });

        // then
        expect(err).to.be.instanceOf(ChatForbiddenError);
        expect(err.message).to.equal('User has not the right to use this chat');
      });
    });

    context('when user does not own the chat', function () {
      it('should throw a ChatForbiddenError', async function () {
        // given
        const chat = new Chat({
          id: '123456-chatId',
          configurationId: 'uneConfigQuiExist',
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });
        await chatTemporaryStorage.save({
          key: '123456-chatId',
          value: chat.toDTO(),
          expirationDelaySeconds: ms('24h'),
        });

        // when
        const err = await catchErr(prompt)({ chatId: '123456-chatId', userId: 456123, message: 'un message' });

        // then
        expect(err).to.be.instanceOf(ChatForbiddenError);
        expect(err.message).to.equal('User has not the right to use this chat');
      });
    });

    context('checking maxChars limit', function () {
      it('should throw a TooLargeMessageInputError when maxChars is exceeded', async function () {
        // given
        const chat = new Chat({
          id: '123-chatId',
          configurationId: 'uneConfigQuiExist',
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });
        await chatTemporaryStorage.save({
          key: '123-chatId',
          value: chat.toDTO(),
          expirationDelaySeconds: ms('24h'),
        });
        const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
          .get('/configurations/uneConfigQuiExist')
          .reply(200, {
            llm: {
              historySize: 123,
            },
            challenge: {
              inputMaxChars: 5,
              inputMaxPrompts: 789,
            },
          });

        // when
        const err = await catchErr(prompt)({ chatId: '123-chatId', userId: 123, message: 'un message' });

        // then
        expect(err).to.be.instanceOf(TooLargeMessageInputError);
        expect(err.message).to.equal("You've reached the max characters input");
        expect(llmConfigurationScope.isDone()).to.be.true;
      });
    });

    context('checking maxPrompts limit', function () {
      it('should ignore messages from LLM when checking for maxPrompts limit', async function () {
        // given
        const chat = new Chat({
          id: '123-chatId',
          configurationId: 'uneConfigQuiExist',
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'coucou LLM1', isFromUser: false }),
            new Message({ content: 'coucou LLM2', isFromUser: false }),
            new Message({ content: 'coucou user', isFromUser: true }),
          ],
        });
        await chatTemporaryStorage.save({
          key: chat.id,
          value: chat.toDTO(),
          expirationDelaySeconds: ms('24h'),
        });
        const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
          .get('/configurations/uneConfigQuiExist')
          .reply(200, {
            llm: {
              historySize: 123,
            },
            challenge: {
              inputMaxChars: 255,
              inputMaxPrompts: 2,
            },
          });
        const llmPostPromptScope = nock('https://llm-test.pix.fr/api')
          .post('/chat', {
            configurationId: 'uneConfigQuiExist',
            history: [
              { content: 'coucou LLM1', role: 'assistant' },
              { content: 'coucou LLM2', role: 'assistant' },
              { content: 'coucou user', role: 'user' },
            ],
            prompt: 'un message',
          })
          .reply(201, Readable.from(['19:{"message":"salut"}']));

        // when
        const stream = await prompt({ chatId: '123-chatId', userId: 123, message: 'un message' });

        // then
        const parts = [];
        const decoder = new TextDecoder();
        for await (const chunk of stream) {
          parts.push(decoder.decode(chunk));
        }
        const llmResponse = parts.join('');
        expect(llmResponse).to.deep.equal('data: salut\n\n');
        expect(llmConfigurationScope.isDone()).to.be.true;
        expect(llmPostPromptScope.isDone()).to.be.true;
      });

      it('should throw a MaxPromptsReachedError when user prompts exceed max', async function () {
        // given
        const chat = new Chat({
          id: '123-chatId',
          configurationId: 'uneConfigQuiExist',
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'coucou user1', isFromUser: true }),
            new Message({ content: 'coucou LLM2', isFromUser: false }),
            new Message({ content: 'coucou user2', isFromUser: true }),
          ],
        });
        await chatTemporaryStorage.save({
          key: chat.id,
          value: chat.toDTO(),
          expirationDelaySeconds: ms('24h'),
        });
        const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
          .get('/configurations/uneConfigQuiExist')
          .reply(200, {
            llm: {
              historySize: 123,
            },
            challenge: {
              inputMaxChars: 255,
              inputMaxPrompts: 2,
            },
          });

        // when
        const err = await catchErr(prompt)({ chatId: '123-chatId', userId: 123, message: 'un message' });

        // then
        expect(err).to.be.instanceOf(MaxPromptsReachedError);
        expect(err.message).to.equal("You've reached the max prompts authorized");
        expect(llmConfigurationScope.isDone()).to.be.true;
      });
    });

    context('success cases', function () {
      context('when a prompt is provided', function () {
        context('when no attachmentName is provided', function () {
          it('should return a stream which will contain the llm response', async function () {
            // given
            const chat = new Chat({
              id: '123-chatId',
              configurationId: 'uneConfigQuiExist',
              hasAttachmentContextBeenAdded: false,
              messages: [
                new Message({ content: 'coucou user1', isFromUser: true }),
                new Message({ content: 'coucou LLM1', isFromUser: false }),
              ],
            });
            await chatTemporaryStorage.save({
              key: chat.id,
              value: chat.toDTO(),
              expirationDelaySeconds: ms('24h'),
            });
            const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
              .get('/configurations/uneConfigQuiExist')
              .reply(200, {
                llm: {
                  historySize: 123,
                },
                challenge: {
                  inputMaxChars: 255,
                  inputMaxPrompts: 100,
                },
              });
            const llmPostPromptScope = nock('https://llm-test.pix.fr/api')
              .post('/chat', {
                configurationId: 'uneConfigQuiExist',
                history: [
                  { content: 'coucou user1', role: 'user' },
                  { content: 'coucou LLM1', role: 'assistant' },
                ],
                prompt: 'un message',
              })
              .reply(
                201,
                Readable.from([
                  '60:{"ceci":"nest pas important","message":"coucou c\'est super"}',
                  '40:{"message":"\\nle couscous c plutot bon"}47:{"message":" mais la paella c pas mal aussi\\n"}',
                  '29:{"jecrois":{"que":"jaifini"}}',
                ]),
              );

            // when
            const stream = await prompt({
              chatId: '123-chatId',
              userId: 123,
              message: 'un message',
              attachmentName: null,
            });

            // then
            const parts = [];
            const decoder = new TextDecoder();
            for await (const chunk of stream) {
              parts.push(decoder.decode(chunk));
            }
            const llmResponse = parts.join('');
            expect(llmResponse).to.deep.equal(
              "data: coucou c'est super\n\ndata: \ndata: le couscous c plutot bon\n\ndata:  mais la paella c pas mal aussi\ndata: \n\n",
            );
            expect(await chatTemporaryStorage.get('123-chatId')).to.deep.equal({
              id: '123-chatId',
              configurationId: 'uneConfigQuiExist',
              hasAttachmentContextBeenAdded: false,
              messages: [
                { content: 'coucou user1', isFromUser: true },
                { content: 'coucou LLM1', isFromUser: false },
                { content: 'un message', isFromUser: true },
                {
                  content: "coucou c'est super\nle couscous c plutot bon mais la paella c pas mal aussi\n",
                  isFromUser: false,
                },
              ],
            });
            expect(llmConfigurationScope.isDone()).to.be.true;
            expect(llmPostPromptScope.isDone()).to.be.true;
          });
        });
        context('when attachmentName is provided', function () {
          context('when no attachmentName is expected for the given configuration', function () {
            it('should throw a NoAttachmentNeededError', async function () {
              // given
              const chat = new Chat({
                id: '123-chatId',
                configurationId: 'uneConfigQuiExist',
                hasAttachmentContextBeenAdded: false,
                messages: [
                  new Message({ content: 'coucou user1', isFromUser: true }),
                  new Message({ content: 'coucou LLM2', isFromUser: false }),
                  new Message({ content: 'coucou user2', isFromUser: true }),
                ],
              });
              await chatTemporaryStorage.save({
                key: chat.id,
                value: chat.toDTO(),
                expirationDelaySeconds: ms('24h'),
              });
              const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                .get('/configurations/uneConfigQuiExist')
                .reply(200, {
                  llm: {
                    historySize: 123,
                  },
                  challenge: {
                    inputMaxChars: 255,
                    inputMaxPrompts: 2,
                  },
                });

              // when
              const err = await catchErr(prompt)({
                chatId: '123-chatId',
                userId: 123,
                message: 'un message',
                attachmentName: 'un_attachment.pdf',
              });

              // then
              expect(err).to.be.instanceOf(NoAttachmentNeededError);
              expect(err.message).to.equal(
                'Attachment has been provided but is not expected for the given configuration',
              );
              expect(llmConfigurationScope.isDone()).to.be.true;
            });
          });
          context('when attachmentName is not the expected one for the given configuration', function () {
            it(
              'should return a stream which will contain the attachment event and the llm response while ' +
                'ignoring the invalid attachmentName by not adding anything to the context',
              async function () {
                // given
                const chat = new Chat({
                  id: '123-chatId',
                  configurationId: 'uneConfigQuiExist',
                  hasAttachmentContextBeenAdded: false,
                  messages: [
                    new Message({ content: 'coucou user1', isFromUser: true }),
                    new Message({ content: 'coucou LLM1', isFromUser: false }),
                  ],
                });
                await chatTemporaryStorage.save({
                  key: chat.id,
                  value: chat.toDTO(),
                  expirationDelaySeconds: ms('24h'),
                });
                const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                  .get('/configurations/uneConfigQuiExist')
                  .reply(200, {
                    llm: {
                      historySize: 123,
                    },
                    challenge: {
                      inputMaxChars: 255,
                      inputMaxPrompts: 100,
                    },
                    attachment: {
                      name: 'expected_file.txt',
                      context: 'add me in the chat !',
                    },
                  });
                const llmPostPromptScope = nock('https://llm-test.pix.fr/api')
                  .post('/chat', {
                    configurationId: 'uneConfigQuiExist',
                    history: [
                      { content: 'coucou user1', role: 'user' },
                      { content: 'coucou LLM1', role: 'assistant' },
                    ],
                    prompt: 'un message',
                  })
                  .reply(
                    201,
                    Readable.from([
                      '60:{"ceci":"nest pas important","message":"coucou c\'est super"}',
                      '40:{"message":"\\nle couscous c plutot bon"}47:{"message":" mais la paella c pas mal aussi\\n"}',
                      '29:{"jecrois":{"que":"jaifini"}}',
                    ]),
                  );

                // when
                const stream = await prompt({
                  chatId: '123-chatId',
                  userId: 123,
                  message: 'un message',
                  attachmentName: 'invalid_file.txt',
                });

                // then
                const parts = [];
                const decoder = new TextDecoder();
                for await (const chunk of stream) {
                  parts.push(decoder.decode(chunk));
                }
                const llmResponse = parts.join('');
                const attachmentMessage = 'event: attachment\ndata: \n\n';
                const llmMessage =
                  "data: coucou c'est super\n\ndata: \ndata: le couscous c plutot bon\n\ndata:  mais la paella c pas mal aussi\ndata: \n\n";
                expect(llmResponse).to.deep.equal(attachmentMessage + llmMessage);
                expect(await chatTemporaryStorage.get('123-chatId')).to.deep.equal({
                  id: '123-chatId',
                  configurationId: 'uneConfigQuiExist',
                  hasAttachmentContextBeenAdded: false,
                  messages: [
                    { content: 'coucou user1', isFromUser: true },
                    { content: 'coucou LLM1', isFromUser: false },
                    { content: 'un message', isFromUser: true },
                    {
                      content: "coucou c'est super\nle couscous c plutot bon mais la paella c pas mal aussi\n",
                      isFromUser: false,
                    },
                  ],
                });
                expect(llmConfigurationScope.isDone()).to.be.true;
                expect(llmPostPromptScope.isDone()).to.be.true;
              },
            );
          });
          context('when attachmentName is the expected one for the given configuration', function () {
            context('when the context for this attachmentName has already been added', function () {
              it(
                'should return a stream which will contain the attachment event and the llm response while ' +
                  'not adding the attachment context in the conversation a second time',
                async function () {
                  // given
                  const chat = new Chat({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: true,
                    messages: [
                      new Message({ content: 'coucou user1', isFromUser: true }),
                      new Message({ content: 'coucou LLM1', isFromUser: false }),
                      new Message({
                        content:
                          'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                        isFromUser: true,
                      }),
                      new Message({
                        content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                        isFromUser: false,
                      }),
                      new Message({ content: 'coucou user2', isFromUser: true }),
                      new Message({ content: 'coucou LLM2', isFromUser: false }),
                    ],
                  });
                  await chatTemporaryStorage.save({
                    key: chat.id,
                    value: chat.toDTO(),
                    expirationDelaySeconds: ms('24h'),
                  });
                  const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                    .get('/configurations/uneConfigQuiExist')
                    .reply(200, {
                      llm: {
                        historySize: 123,
                      },
                      challenge: {
                        inputMaxChars: 255,
                        inputMaxPrompts: 100,
                      },
                      attachment: {
                        name: 'expected_file.txt',
                        context: 'add me in the chat !',
                      },
                    });
                  const llmPostPromptScope = nock('https://llm-test.pix.fr/api')
                    .post('/chat', {
                      configurationId: 'uneConfigQuiExist',
                      history: [
                        { content: 'coucou user1', role: 'user' },
                        { content: 'coucou LLM1', role: 'assistant' },
                        {
                          content:
                            'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                          role: 'user',
                        },
                        {
                          content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                          role: 'assistant',
                        },
                        { content: 'coucou user2', role: 'user' },
                        { content: 'coucou LLM2', role: 'assistant' },
                      ],
                      prompt: 'un message',
                    })
                    .reply(
                      201,
                      Readable.from([
                        '60:{"ceci":"nest pas important","message":"coucou c\'est super"}',
                        '40:{"message":"\\nle couscous c plutot bon"}47:{"message":" mais la paella c pas mal aussi\\n"}',
                        '29:{"jecrois":{"que":"jaifini"}}',
                      ]),
                    );

                  // when
                  const stream = await prompt({
                    chatId: '123-chatId',
                    userId: 123,
                    message: 'un message',
                    attachmentName: 'expected_file.txt',
                  });

                  // then
                  const parts = [];
                  const decoder = new TextDecoder();
                  for await (const chunk of stream) {
                    parts.push(decoder.decode(chunk));
                  }
                  const llmResponse = parts.join('');
                  const attachmentMessage = 'event: attachment\ndata: \n\n';
                  const llmMessage =
                    "data: coucou c'est super\n\ndata: \ndata: le couscous c plutot bon\n\ndata:  mais la paella c pas mal aussi\ndata: \n\n";
                  expect(llmResponse).to.deep.equal(attachmentMessage + llmMessage);
                  expect(await chatTemporaryStorage.get('123-chatId')).to.deep.equal({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: true,
                    messages: [
                      { content: 'coucou user1', isFromUser: true },
                      { content: 'coucou LLM1', isFromUser: false },
                      {
                        content:
                          'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                        isFromUser: true,
                      },
                      {
                        content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                        isFromUser: false,
                      },
                      { content: 'coucou user2', isFromUser: true },
                      { content: 'coucou LLM2', isFromUser: false },
                      { content: 'un message', isFromUser: true },
                      {
                        content: "coucou c'est super\nle couscous c plutot bon mais la paella c pas mal aussi\n",
                        isFromUser: false,
                      },
                    ],
                  });
                  expect(llmConfigurationScope.isDone()).to.be.true;
                  expect(llmPostPromptScope.isDone()).to.be.true;
                },
              );
            });
            context('when the context for this attachmentName has not been added yet', function () {
              it(
                'should return a stream which will contain the attachment event and the llm response while ' +
                  'adding the attachment context in the conversation',
                async function () {
                  // given
                  const chat = new Chat({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: false,
                    messages: [
                      new Message({ content: 'coucou user1', isFromUser: true }),
                      new Message({ content: 'coucou LLM1', isFromUser: false }),
                    ],
                  });
                  await chatTemporaryStorage.save({
                    key: chat.id,
                    value: chat.toDTO(),
                    expirationDelaySeconds: ms('24h'),
                  });
                  const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                    .get('/configurations/uneConfigQuiExist')
                    .reply(200, {
                      llm: {
                        historySize: 123,
                      },
                      challenge: {
                        inputMaxChars: 255,
                        inputMaxPrompts: 100,
                      },
                      attachment: {
                        name: 'expected_file.txt',
                        context: 'add me in the chat !',
                      },
                    });
                  const llmPostPromptScope = nock('https://llm-test.pix.fr/api')
                    .post('/chat', {
                      configurationId: 'uneConfigQuiExist',
                      history: [
                        { content: 'coucou user1', role: 'user' },
                        { content: 'coucou LLM1', role: 'assistant' },
                        {
                          content:
                            'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                          role: 'user',
                        },
                        {
                          content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                          role: 'assistant',
                        },
                      ],
                      prompt: 'un message',
                    })
                    .reply(
                      201,
                      Readable.from([
                        '60:{"ceci":"nest pas important","message":"coucou c\'est super"}',
                        '40:{"message":"\\nle couscous c plutot bon"}47:{"message":" mais la paella c pas mal aussi\\n"}',
                        '29:{"jecrois":{"que":"jaifini"}}',
                      ]),
                    );

                  // when
                  const stream = await prompt({
                    chatId: '123-chatId',
                    userId: 123,
                    message: 'un message',
                    attachmentName: 'expected_file.txt',
                  });

                  // then
                  const parts = [];
                  const decoder = new TextDecoder();
                  for await (const chunk of stream) {
                    parts.push(decoder.decode(chunk));
                  }
                  const llmResponse = parts.join('');
                  const attachmentMessage = 'event: attachment\ndata: \n\n';
                  const llmMessage =
                    "data: coucou c'est super\n\ndata: \ndata: le couscous c plutot bon\n\ndata:  mais la paella c pas mal aussi\ndata: \n\n";
                  expect(llmResponse).to.deep.equal(attachmentMessage + llmMessage);
                  expect(await chatTemporaryStorage.get('123-chatId')).to.deep.equal({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: true,
                    messages: [
                      { content: 'coucou user1', isFromUser: true },
                      { content: 'coucou LLM1', isFromUser: false },
                      {
                        content:
                          'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                        isFromUser: true,
                      },
                      {
                        content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                        isFromUser: false,
                      },
                      { content: 'un message', isFromUser: true },
                      {
                        content: "coucou c'est super\nle couscous c plutot bon mais la paella c pas mal aussi\n",
                        isFromUser: false,
                      },
                    ],
                  });
                  expect(llmConfigurationScope.isDone()).to.be.true;
                  expect(llmPostPromptScope.isDone()).to.be.true;
                },
              );
            });
          });
        });
      });
      context('when no prompt is provided', function () {
        context('when no attachmentName is provided', function () {
          it('should throw a NoAttachmentNorMessageProvidedError', async function () {
            // given
            const chat = new Chat({
              id: '123-chatId',
              configurationId: 'uneConfigQuiExist',
              hasAttachmentContextBeenAdded: false,
              messages: [
                new Message({ content: 'coucou user1', isFromUser: true }),
                new Message({ content: 'coucou LLM2', isFromUser: false }),
              ],
            });
            await chatTemporaryStorage.save({
              key: chat.id,
              value: chat.toDTO(),
              expirationDelaySeconds: ms('24h'),
            });
            const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
              .get('/configurations/uneConfigQuiExist')
              .reply(200, {
                llm: {
                  historySize: 123,
                },
                challenge: {
                  inputMaxChars: 255,
                  inputMaxPrompts: 255,
                },
              });

            // when
            const err = await catchErr(prompt)({
              chatId: '123-chatId',
              userId: 123,
              message: null,
              attachmentName: null,
            });

            // then
            expect(err).to.be.instanceOf(NoAttachmentNorMessageProvidedError);
            expect(err.message).to.equal('At least a message or an attachment, if applicable, must be provided');
            expect(llmConfigurationScope.isDone()).to.be.true;
          });
        });
        context('when attachmentName is provided', function () {
          context('when no attachmentName is expected for the given configuration', function () {
            it('should throw a NoAttachmentNeededError', async function () {
              // given
              const chat = new Chat({
                id: '123-chatId',
                configurationId: 'uneConfigQuiExist',
                hasAttachmentContextBeenAdded: false,
                messages: [
                  new Message({ content: 'coucou user1', isFromUser: true }),
                  new Message({ content: 'coucou LLM2', isFromUser: false }),
                  new Message({ content: 'coucou user2', isFromUser: true }),
                ],
              });
              await chatTemporaryStorage.save({
                key: chat.id,
                value: chat.toDTO(),
                expirationDelaySeconds: ms('24h'),
              });
              const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                .get('/configurations/uneConfigQuiExist')
                .reply(200, {
                  llm: {
                    historySize: 123,
                  },
                  challenge: {
                    inputMaxChars: 255,
                    inputMaxPrompts: 2,
                  },
                });

              // when
              const err = await catchErr(prompt)({
                chatId: '123-chatId',
                userId: 123,
                message: null,
                attachmentName: 'un_attachment.pdf',
              });

              // then
              expect(err).to.be.instanceOf(NoAttachmentNeededError);
              expect(err.message).to.equal(
                'Attachment has been provided but is not expected for the given configuration',
              );
              expect(llmConfigurationScope.isDone()).to.be.true;
            });
          });
          context('when attachmentName is not the expected one for the given configuration', function () {
            it(
              'should return a stream which will contain the attachment event while ' +
                'ignoring the invalid attachmentName by not adding anything to the context',
              async function () {
                // given
                const chat = new Chat({
                  id: '123-chatId',
                  configurationId: 'uneConfigQuiExist',
                  hasAttachmentContextBeenAdded: false,
                  messages: [
                    new Message({ content: 'coucou user1', isFromUser: true }),
                    new Message({ content: 'coucou LLM1', isFromUser: false }),
                  ],
                });
                await chatTemporaryStorage.save({
                  key: chat.id,
                  value: chat.toDTO(),
                  expirationDelaySeconds: ms('24h'),
                });
                const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                  .get('/configurations/uneConfigQuiExist')
                  .reply(200, {
                    llm: {
                      historySize: 123,
                    },
                    challenge: {
                      inputMaxChars: 255,
                      inputMaxPrompts: 100,
                    },
                    attachment: {
                      name: 'expected_file.txt',
                      context: 'add me in the chat !',
                    },
                  });

                // when
                const stream = await prompt({
                  chatId: '123-chatId',
                  userId: 123,
                  message: null,
                  attachmentName: 'invalid_file.txt',
                });

                // then
                const parts = [];
                const decoder = new TextDecoder();
                for await (const chunk of stream) {
                  parts.push(decoder.decode(chunk));
                }
                const llmResponse = parts.join('');
                expect(llmResponse).to.deep.equal('event: attachment\ndata: \n\n');
                expect(await chatTemporaryStorage.get('123-chatId')).to.deep.equal({
                  id: '123-chatId',
                  configurationId: 'uneConfigQuiExist',
                  hasAttachmentContextBeenAdded: false,
                  messages: [
                    { content: 'coucou user1', isFromUser: true },
                    { content: 'coucou LLM1', isFromUser: false },
                  ],
                });
                expect(llmConfigurationScope.isDone()).to.be.true;
              },
            );
          });
          context('when attachmentName is the expected one for the given configuration', function () {
            context('when the context for this attachmentName has already been added', function () {
              it(
                'should return a stream which will contain the attachment event while ' +
                  'not adding the attachment context in the conversation a second time',
                async function () {
                  // given
                  const chat = new Chat({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: true,
                    messages: [
                      new Message({ content: 'coucou user1', isFromUser: true }),
                      new Message({ content: 'coucou LLM1', isFromUser: false }),
                      new Message({
                        content:
                          'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                        isFromUser: true,
                      }),
                      new Message({
                        content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                        isFromUser: false,
                      }),
                      new Message({ content: 'coucou user2', isFromUser: true }),
                      new Message({ content: 'coucou LLM2', isFromUser: false }),
                    ],
                  });
                  await chatTemporaryStorage.save({
                    key: chat.id,
                    value: chat.toDTO(),
                    expirationDelaySeconds: ms('24h'),
                  });
                  const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                    .get('/configurations/uneConfigQuiExist')
                    .reply(200, {
                      llm: {
                        historySize: 123,
                      },
                      challenge: {
                        inputMaxChars: 255,
                        inputMaxPrompts: 100,
                      },
                      attachment: {
                        name: 'expected_file.txt',
                        context: 'add me in the chat !',
                      },
                    });

                  // when
                  const stream = await prompt({
                    chatId: '123-chatId',
                    userId: 123,
                    message: null,
                    attachmentName: 'expected_file.txt',
                  });

                  // then
                  const parts = [];
                  const decoder = new TextDecoder();
                  for await (const chunk of stream) {
                    parts.push(decoder.decode(chunk));
                  }
                  const llmResponse = parts.join('');
                  expect(llmResponse).to.deep.equal('event: attachment\ndata: \n\n');
                  expect(await chatTemporaryStorage.get('123-chatId')).to.deep.equal({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: true,
                    messages: [
                      { content: 'coucou user1', isFromUser: true },
                      { content: 'coucou LLM1', isFromUser: false },
                      {
                        content:
                          'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                        isFromUser: true,
                      },
                      {
                        content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                        isFromUser: false,
                      },
                      { content: 'coucou user2', isFromUser: true },
                      { content: 'coucou LLM2', isFromUser: false },
                    ],
                  });
                  expect(llmConfigurationScope.isDone()).to.be.true;
                },
              );
            });
            context('when the context for this attachmentName has not been added yet', function () {
              it(
                'should return a stream which will contain the attachment event while ' +
                  'adding the attachment context in the conversation',
                async function () {
                  // given
                  const chat = new Chat({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: false,
                    messages: [
                      new Message({ content: 'coucou user1', isFromUser: true }),
                      new Message({ content: 'coucou LLM1', isFromUser: false }),
                    ],
                  });
                  await chatTemporaryStorage.save({
                    key: chat.id,
                    value: chat.toDTO(),
                    expirationDelaySeconds: ms('24h'),
                  });
                  const llmConfigurationScope = nock('https://llm-test.pix.fr/api')
                    .get('/configurations/uneConfigQuiExist')
                    .reply(200, {
                      llm: {
                        historySize: 123,
                      },
                      challenge: {
                        inputMaxChars: 255,
                        inputMaxPrompts: 100,
                      },
                      attachment: {
                        name: 'expected_file.txt',
                        context: 'add me in the chat !',
                      },
                    });

                  // when
                  const stream = await prompt({
                    chatId: '123-chatId',
                    userId: 123,
                    message: null,
                    attachmentName: 'expected_file.txt',
                  });

                  // then
                  const parts = [];
                  const decoder = new TextDecoder();
                  for await (const chunk of stream) {
                    parts.push(decoder.decode(chunk));
                  }
                  const llmResponse = parts.join('');
                  expect(llmResponse).to.deep.equal('event: attachment\ndata: \n\n');
                  expect(await chatTemporaryStorage.get('123-chatId')).to.deep.equal({
                    id: '123-chatId',
                    configurationId: 'uneConfigQuiExist',
                    hasAttachmentContextBeenAdded: true,
                    messages: [
                      { content: 'coucou user1', isFromUser: true },
                      { content: 'coucou LLM1', isFromUser: false },
                      {
                        content:
                          'Ajoute le fichier fictif "expected_file.txt" à ton contexte. Voici le contenu du fichier :\nadd me in the chat !',
                        isFromUser: true,
                      },
                      {
                        content: 'Le contenu du fichier fictif a été ajouté au contexte.',
                        isFromUser: false,
                      },
                    ],
                  });
                  expect(llmConfigurationScope.isDone()).to.be.true;
                },
              );
            });
          });
        });
      });
    });
  });
});
