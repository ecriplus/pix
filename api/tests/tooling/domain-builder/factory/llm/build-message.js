import { Message } from '../../../../../src/llm/domain/models/Chat.js';

export function buildUserMessage({
  index = 0,
  content = 'la capitale de la finlande stp',
  attachmentName = null,
  wasModerated = false,
} = {}) {
  return new Message({
    index,
    content,
    attachmentName,
    emitter: 'user',
    wasModerated,
  });
}

export function buildAssistantMessage({ index = 1, content = 'Helsinki bien sûr !!' } = {}) {
  return new Message({
    index,
    content,
    attachmentName: null,
    emitter: 'assistant',
    wasModerated: null,
  });
}
