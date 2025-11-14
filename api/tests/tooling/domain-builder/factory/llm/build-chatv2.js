import { ChatV2 } from '../../../../../src/llm/domain/models/ChatV2.js';
import { buildConfiguration } from './build-configuration.js';

export function buildChatV2({
  id = 'some-uuid',
  userId = 123,
  assessmentId = 456,
  challengeId = 'recChallenge1',
  passageId = null,
  moduleId = null,
  configurationId = 'some-conf-uuid',
  configuration = buildConfiguration(),
  haveVictoryConditionsBeenFulfilled = null,
  messages = [],
  totalInputTokens = 200,
  totalOutputTokens = 400,
} = {}) {
  return new ChatV2({
    id,
    userId,
    assessmentId,
    challengeId,
    passageId,
    moduleId,
    configurationId,
    configuration,
    haveVictoryConditionsBeenFulfilled,
    messages,
    totalInputTokens,
    totalOutputTokens,
  });
}
