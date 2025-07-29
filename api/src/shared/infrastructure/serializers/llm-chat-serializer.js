export function serialize(llmChatDTO) {
  return {
    inputMaxChars: llmChatDTO.inputMaxChars,
    inputMaxPrompts: llmChatDTO.inputMaxPrompts,
    attachmentName: llmChatDTO.attachmentName,
    context: llmChatDTO.context,
    id: llmChatDTO.id,
  };
}
