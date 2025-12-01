export function getVictoryConditionsSuccess() {
  return 'event: victory-conditions-success\ndata: \n\n';
}

export function getMessageModerated() {
  return 'event: user-message-moderated\ndata: \n\n';
}

export function getPing() {
  return 'event: ping\ndata: \n\n';
}

export function getError() {
  return 'event: error\ndata: \n\n';
}

export function getAttachmentMessage(isValid) {
  return 'event: attachment-' + (isValid ? 'success' : 'failure') + '\ndata: \n\n';
}

export function getDebugInputTokens(inputTokens) {
  return `event: debug-input-tokens\ndata: ${inputTokens}\n\n`;
}

export function getDebugOutputTokens(outputTokens) {
  return `event: debug-output-tokens\ndata: ${outputTokens}\n\n`;
}

export function getFormattedMessage(message) {
  const formattedMessage = message.replaceAll('\n', '\ndata: ');
  return `data: ${formattedMessage}\n\n`;
}
