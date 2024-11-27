/**
 * @typedef {import ('../../domain/usecases/index.js').CenterRepository} CenterRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { InvalidScoWhitelistError } from '../errors.js';

export const importScoWhitelist = withTransaction(
  /**
   * @param {Object} params
   * @param {CenterRepository} params.centerRepository
   */
  async ({ externalIds = [], centerRepository }) => {
    await centerRepository.resetWhitelist();
    const numberOfUpdatedLines = await centerRepository.addToWhitelistByExternalIds({ externalIds });

    if (externalIds.length !== numberOfUpdatedLines) {
      throw new InvalidScoWhitelistError({
        numberOfExternalIdsInInput: externalIds.length,
        numberOfValidExternalIds: numberOfUpdatedLines,
      });
    }
  },
);
