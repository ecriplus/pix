import { Configuration } from '../../../domain/models/Configuration.js';

export function deserialize(payload) {
  return new Configuration({
    historySize: payload.llm.historySize,
    inputMaxChars: payload.challenge.inputMaxChars,
    inputMaxPrompts: payload.challenge.inputMaxPrompts,
    attachmentName: payload.attachment?.name,
    attachmentContext: payload.attachment?.context,
  });
}
