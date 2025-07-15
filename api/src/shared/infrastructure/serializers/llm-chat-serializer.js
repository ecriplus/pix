export function serialize(llmChatDTO) {
  return {
    inputMaxChars: llmChatDTO.inputMaxChars,
    inputMaxPrompts: llmChatDTO.inputMaxPrompts,
    attachmentName: llmChatDTO.attachmentName,
    chatId: llmChatDTO.id, // FIXME remove as soon as PIX-18710 is in production
    id: llmChatDTO.id,
  };
}
