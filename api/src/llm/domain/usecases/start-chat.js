import { Chat } from '../models/Chat.js';

export async function startChat({
  configuration,
  configId,
  userId,
  chatRepository,
  configurationRepository,
  randomUUID,
}) {
  if (!configuration) {
    configuration = await configurationRepository.get(configId);
  }
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
