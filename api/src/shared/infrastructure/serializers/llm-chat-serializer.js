export function serialize(llmChatDTO) {
  return {
    inputMaxChars: llmChatDTO.inputMaxChars,
    inputMaxPrompts: llmChatDTO.inputMaxPrompts,
    attachmentName: llmChatDTO.attachmentName,
    chatId: llmChatDTO.id
  }
}
