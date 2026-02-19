import { AsyncLocalStorage } from 'node:async_hooks';

import { knex } from '../../../db/knex-database-connection.js';

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

  static async addSuccessHandler(handler) {
    const store = asyncLocalStorage.getStore();

    if (store?.transaction) {
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
