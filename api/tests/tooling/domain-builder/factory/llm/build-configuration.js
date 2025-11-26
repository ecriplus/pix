import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';

export function buildConfiguration({
  systemPrompt = 'réponds gentiment',
  inputMaxChars = 160,
  inputMaxPrompts = 3,
  name = 'foo config',
  outputMaxToken = 150,
  attachmentName = null,
  attachmentContext = null,
  previewModerationPrompt = null,
  previewValidationPrompt = null,
} = {}) {
  return new Configuration({
    name,
    llm: {
      outputMaxToken,
    },
    challenge: {
      inputMaxChars,
      inputMaxPrompts,
      systemPrompt,
    },
    attachment: attachmentName
      ? {
          name: attachmentName,
          context: attachmentContext,
        }
      : undefined,
    preview: {
      moderationPrompt: previewModerationPrompt,
      validationPrompt: previewValidationPrompt,
    },
  });
}
