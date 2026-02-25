import { AsyncLocalStorage } from 'node:async_hooks';

import { knex } from '../../../db/knex-database-connection.js';
import { featureToggles } from '../infrastructure/feature-toggles/index.js';

const asyncLocalStorage = new AsyncLocalStorage();

class DomainTransaction {
  constructor(knexTransaction) {
    this.knexTransaction = knexTransaction;
    this.successHandlers = [];
  }

  static execute(lambda, transactionConfig) {
    const existingConn = DomainTransaction.getConnection();
    if (existingConn.isTransaction) {
      return lambda();
    }
    let domainTransaction;
    return knex
      .transaction((trx) => {
        domainTransaction = new DomainTransaction(trx);
        return asyncLocalStorage.run({ transaction: domainTransaction }, lambda, domainTransaction);
      }, transactionConfig)
      .then(async (result) => {
        for (const handler of domainTransaction.successHandlers) {
          await handler();
        }
        return result;
      });
  }

  /**
   *
   * @param {Function} handler : handler executed after transaction is successful
   *
   * @description Important notice: success handlers shall not be massively used
   * You should be able to declare code to be exectuted after transaction success in a better way
   * i.e declaring code **after** DomainTransaction.execture call :
   *  -- myUsecase.js
   *  function myUsecase() {
   *    await DomainTransaction.execute(() => {
   *      -- transactional code
   *    });
   *
   *    -- sending job after transaction is successful
   *    await myJob.performAsync(payload);
   *  }
   */
  static async addSuccessHandler(handler) {
    const store = asyncLocalStorage.getStore();
    const isSuccessHandlerEnabled = await featureToggles.get('successHandlersForDomainTransaction');

    if (store?.transaction && isSuccessHandlerEnabled) {
      store.transaction.successHandlers.push(handler);
    } else {
      await handler();
    }
  }

  /**
   * @returns {import('knex').Knex | import('knex').Knex.Transaction}
   */
  static getConnection() {
    const store = asyncLocalStorage.getStore();

    if (store?.transaction) {
      const domainTransaction = store.transaction;
      return domainTransaction.knexTransaction;
    }
    return knex;
  }

  static emptyTransaction() {
    return new DomainTransaction(null);
  }
}

/**
 * @template F
 * @param {F} func
 * @param {import('knex').Knex.TransactionConfig=} transactionConfig
 * @returns {F}
 */
function withTransaction(func, transactionConfig) {
  return (...args) => DomainTransaction.execute(() => func(...args), transactionConfig);
}

export { asyncLocalStorage, DomainTransaction, withTransaction };
