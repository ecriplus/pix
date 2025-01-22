import crypto from 'node:crypto';

import { config } from '../../../shared/config.js';

const SEPARATOR = ':';

export class RefreshToken {
  constructor({ userId, scope, source, value, audience }) {
    this.userId = userId;
    this.scope = scope;
    this.source = source;
    this.value = value;
    this.audience = audience;
  }

  static generate({ userId, scope, source, audience }) {
    const uuid = crypto.randomUUID();
    const value = [userId, scope, uuid].filter(Boolean).join(SEPARATOR);
    return new RefreshToken({ userId, scope, source, value, audience });
  }

  get expirationDelaySeconds() {
    const { refreshTokenLifespanMs, refreshTokenLifespanMsByScope } = config.authentication;
    return (refreshTokenLifespanMsByScope[this.scope] || refreshTokenLifespanMs) / 1000;
  }
}
