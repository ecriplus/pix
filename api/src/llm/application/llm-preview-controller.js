import { getPixAppUrl } from '../../shared/domain/services/url-service.js';
import { ChatForbiddenError } from '../domain/errors.js';
import { Configuration } from '../domain/models/Configuration.js';
import { usecases } from '../domain/usecases/index.js';
import { chatRedisRepository } from '../infrastructure/repositories/index.js';
import { chatRepository } from '../infrastructure/repositories/index.js';
import * as chatSerializer from '../infrastructure/serializers/json/chat-serializer.js';

export const llmPreviewController = {
  async startChat(request, h) {
    const configuration = new Configuration(request.payload.configuration);
    const chat = await usecases.startChat({ configuration });
    const location = getPixAppUrl('fr-FR', { pathname: `/llm/preview/${chat.id}` });
    return h.response().header('Location', location).code(201);
  },

  async getChat(request) {
    let chat = await chatRepository.get(request.params.chatId);

    if (!chat) {
      chat = await chatRedisRepository.get(request.params.chatId);
    }

    if (chat.userId != undefined) {
      throw new ChatForbiddenError();
    }
    return chatSerializer.serialize(chat);
  },

  async promptChat(request, h) {
    const { chatId } = request.params;
    const { prompt, attachmentName } = request.payload;
    const response = await usecases.promptChat({ chatId, message: prompt, attachmentName });
    return h.response(response).type('text/event-stream').code(201);
  },
};
