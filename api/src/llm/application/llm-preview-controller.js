import { config } from '../../shared/config.js';
import { usecases } from '../domain/usecases/index.js';
import { chatRepository } from '../infrastructure/repositories/index.js';
import * as chatSerializer from '../infrastructure/serializers/json/chat-serializer.js';
import * as configurationSerializer from '../infrastructure/serializers/json/configuration-serializer.js';

export const llmPreviewController = {
  async startChat(request, h) {
    const configuration = configurationSerializer.deserialize(request.payload.configuration);
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
};
