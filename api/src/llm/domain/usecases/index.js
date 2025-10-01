import { randomUUID } from 'node:crypto';

import { redisMutex } from '../../../shared/infrastructure/mutex/RedisMutex.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import * as repositories from '../../infrastructure/repositories/index.js';
import * as toEventStream from '../../infrastructure/streaming/to-event-stream.js';

const dependencies = {
  ...repositories,
  toEventStream,
  randomUUID,
  redisMutex,
};

import { promptChat } from './prompt-chat.js';
import { startChat } from './start-chat.js';

const usecasesWithoutInjectedDependencies = {
  promptChat,
  startChat,
};

export const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);
