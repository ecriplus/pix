import jsonwebtoken from 'jsonwebtoken';

import { config } from '../../config.js';
import { httpAgent } from '../http-agent.js';

export const STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
};

export const API_DATA_QUERIES = config.apiData.queries || {};

export class ApiData {
  #token;

  constructor(apiDataUrl, apiDataCredentials) {
    this.apiDataUrl = apiDataUrl;
    this.apiDataCredentials = apiDataCredentials;
  }

  set token(token) {
    this.#token = token;
  }

  async getToken() {
    if (!this.#token) {
      this.#token = await this.#fetchToken();
      return this.#token;
    }

    const decodedToken = jsonwebtoken.decode(this.#token);
    const preventCloseExpiration = 10;
    const isTokenExpired = decodedToken.exp < Date.now() / 1000 + preventCloseExpiration;

    if (isTokenExpired) {
      this.#token = await this.#fetchToken();
    }

    return this.#token;
  }

  async #fetchToken() {
    if (!this.apiDataCredentials?.username || !this.apiDataCredentials?.password) {
      throw new Error('ApiData credentials are not set');
    }
    const result = await httpAgent.post({
      url: `${this.apiDataUrl}/token`,
      payload: this.apiDataCredentials,
    });
    return result.data.data.access_token;
  }

  async get(queryId, params = []) {
    const token = await this.getToken();
    const result = await httpAgent.post({
      url: `${this.apiDataUrl}/query`,
      payload: { queryId, params },
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }
}

export const apiData = new ApiData(config.apiData.url, config.apiData.credentials);
