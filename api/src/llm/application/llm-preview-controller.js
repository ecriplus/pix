import { config } from '../../shared/config.js';
import { Configuration } from '../domain/models/Configuration.js';
import { usecases } from '../domain/usecases/index.js';
import { chatRepository } from '../infrastructure/repositories/index.js';
import * as chatSerializer from '../infrastructure/serializers/json/chat-serializer.js';

export const llmPreviewController = {
  async startChat(request, h) {
    const configuration = new Configuration(request.payload.configuration);
    const chat = await usecases.startChat({ configuration });
    return h
      .response()
      .header('Location', new URL(`/llm/preview/${chat.id}`, config.domain.pixApp).href)
      .code(201);
  },

  async getChat(request) {
    const chat = await chatRepository.get(request.params.chatId);
    return chatSerializer.serialize(chat);
  },

  async promptChat(request, h) {
    const { chatId } = request.params;
    const { prompt, attachmentName } = request.payload;
    const response = await usecases.promptChat({ chatId, message: prompt, attachmentName });
    return h.response(response).type('text/event-stream').code(201);
  },
};
