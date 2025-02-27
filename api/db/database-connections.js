import { configureGlobalExtensions } from './knex-extensions.js';

class DatabaseConnections {
  #connections = [];

  constructor() {
    configureGlobalExtensions();
  }

  addConnection(connection) {
    this.#connections.push(connection);
  }

  async disconnect() {
    return Promise.all(this.#connections.map((connection) => connection.disconnect()));
  }

  async checkStatuses() {
    return Promise.all(this.#connections.map((connection) => connection.checkStatus()));
  }
}

export const databaseConnections = new DatabaseConnections();
