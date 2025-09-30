import { Chat } from '../models/Chat.js';

export async function startChat({
  configuration,
  configurationId,
  userId,
  assessmentId,
  challengeId,
  passageId,
  moduleId,
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
    assessmentId,
    challengeId,
    moduleId,
    passageId,
    configurationId,
    configuration,
    hasAttachmentContextBeenAdded: false,
    messages: [],
    totalInputTokens: 0,
    totalOutputTokens: 0,
  });
  await chatRepository.save(newChat);
  return newChat;
}
