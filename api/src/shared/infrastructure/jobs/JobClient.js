import PgBoss from 'pg-boss';

export class JobClient {
  static #jobClient;

  #pgBoss = null;
  #isInitialized = false;

  constructor() {
    const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;
    this.#pgBoss = new PgBoss({
      connectionString,
      max: 2, // TODO: add environment variable
      noSupervisor: true,
      noScheduling: true,
    });
  }

  async initialize() {
    await this.#pgBoss.start();
    this.#isInitialized = true;
  }

  #assertIsInitialized() {
    if (!this.#isInitialized) {
      throw new Error('JobClient has not been initialized before use');
    }
  }

  async flushJobs() {
    this.#assertIsInitialized();
    await this.#pgBoss.clearStorage();
  }

  async stop(options) {
    this.#assertIsInitialized();
    await this.#pgBoss.stop(options);
  }

  async send(name, payload, options) {
    this.#assertIsInitialized();
    await this.#pgBoss.send(name, payload, options);
  }

  async fetch(name, count, options) {
    this.#assertIsInitialized();
    return this.#pgBoss.fetch(name, count, options);
  }

  async getSchedules() {
    this.#assertIsInitialized();
    return this.#pgBoss.getSchedules();
  }

  static get instance() {
    if (!JobClient.#jobClient) {
      JobClient.#jobClient = new JobClient();
    }
    return JobClient.#jobClient;
  }
}
