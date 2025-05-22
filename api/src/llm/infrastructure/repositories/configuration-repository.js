import ms from 'ms';

import { config } from '../../../shared/config.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { ConfigurationNotFoundError, LLMApiError } from '../../domain/errors.js';

export const CONFIGURATION_STORAGE_PREFIX = 'llm-configurations';
const configurationTemporaryStorage = temporaryStorage.withPrefix(CONFIGURATION_STORAGE_PREFIX);
const CONFIGURATION_EXPIRATION_DELAY_SECONDS = ms('1h');

const logger = child('llm:api', { event: SCOPES.LLM });

export async function get(id) {
  const cachedConfiguration = await configurationTemporaryStorage.get(id);
  if (cachedConfiguration) {
    return cachedConfiguration;
  }
  const url = config.llm.getConfigurationUrl + '/' + id;
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    logger.error(`error when trying to reach LLM API : ${err}`);
    throw new LLMApiError(err.toString());
  }
  const statusCode = parseInt(response.status);
  const jsonResponse = response.body ? await response.json() : '';
  if (statusCode === 200) {
    await configurationTemporaryStorage.save({
      key: id,
      value: jsonResponse,
      expirationDelaySeconds: CONFIGURATION_EXPIRATION_DELAY_SECONDS,
    });
    return jsonResponse;
  }
  if (statusCode === 404) {
    throw new ConfigurationNotFoundError(id);
  }
  const errorStr = JSON.stringify(jsonResponse, undefined, 2);
  logger.error(`error when reaching LLM API : code (${statusCode}) - ${errorStr}`);
  throw new LLMApiError(`code (${statusCode}) - ${errorStr}`);
}
