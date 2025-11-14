import { MessageV2 } from '../../../../../src/llm/domain/models/ChatV2.js';

export function buildUserMessageV2({
  index = 0,
  content = 'la capitale de la finlande stp',
  attachmentName = null,
  wasModerated = false,
} = {}) {
  return new MessageV2({
    index,
    content,
    attachmentName,
    emitter: 'user',
    wasModerated,
  });
}

export function buildAssistantMessageV2({ index = 1, content = 'Helsinki bien sûr !!' } = {}) {
  return new MessageV2({
    index,
    content,
    attachmentName: null,
    emitter: 'assistant',
    wasModerated: null,
  });
}
