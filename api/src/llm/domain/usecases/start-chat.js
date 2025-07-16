import { Chat } from '../models/Chat.js';

export async function startChat({
  configuration,
  configurationId,
  userId,
  chatRepository,
  configurationRepository,
  randomUUID,
}) {
  if (!configuration) {
    configuration = await configurationRepository.get(configurationId);
  }
  const chatId = randomUUID();
  const newChat = new Chat({
    id: chatId,
    userId,
    configurationId,
    configuration,
    hasAttachmentContextBeenAdded: false,
    messages: [],
  });
  await chatRepository.save(newChat);
  return newChat;
}
