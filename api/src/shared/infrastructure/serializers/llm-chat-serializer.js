export function serialize(llmChatDTO) {
  return {
    inputMaxChars: llmChatDTO.inputMaxChars,
    inputMaxPrompts: llmChatDTO.inputMaxPrompts,
    attachmentName: llmChatDTO.attachmentName,
    hasVictoryConditions: llmChatDTO.hasVictoryConditions,
    context: llmChatDTO.context,
    id: llmChatDTO.id,
  };
}
