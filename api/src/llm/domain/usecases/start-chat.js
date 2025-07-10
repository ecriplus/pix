import { ConfigurationNotFoundError } from '../errors.js';
import { Chat } from '../models/Chat.js';

export async function startChat({ configId, userId, chatRepository, configurationRepository, randomUUID }) {
  if (!configId) {
    throw new ConfigurationNotFoundError('null id provided');
  }
  const configuration = await configurationRepository.get(configId);
  const chatId = randomUUID();
  const newChat = new Chat({
    id: chatId,
    userId,
    configuration,
    hasAttachmentContextBeenAdded: false,
    messages: [],
  });
  await chatRepository.save(newChat);
  return newChat;
}
