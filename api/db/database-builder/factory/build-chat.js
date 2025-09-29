import { randomUUID } from 'node:crypto';

import { databaseBuffer } from '../database-buffer.js';

const TABLE_NAME = 'chats';

const buildChat = function ({
  id = randomUUID(),
  userId = null,
  assessmentId = null,
  challengeId = null,
  configId = null,
  configContent = {
    llm: {
      outputMaxToken: 1,
      historySize: 2,
    },
    challenge: {
      victoryConditions: {
        expectations: [
          {
            type: 'answer_contains',
            value: 'merguez',
          },
        ],
      },
    },
  },
  hasAttachmentContextBeenAdded = false,
  moduleId = null,
  passageId = null,
  startedAt = new Date(),
  totalInputTokens = 0,
  totalOutputTokens = 0,
  updatedAt = new Date(),
} = {}) {
  const values = {
    id,
    userId,
    assessmentId,
    challengeId,
    configId,
    configContent,
    moduleId,
    passageId,
    hasAttachmentContextBeenAdded,
    totalInputTokens,
    totalOutputTokens,
    startedAt,
    updatedAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: TABLE_NAME,
    values,
  });
};

export { buildChat };
