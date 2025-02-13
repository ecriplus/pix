import crypto from 'node:crypto';

import { config } from '../../../shared/config.js';

const SEPARATOR = ':';

export class RefreshToken {
  constructor({ userId, source, value, audience }) {
    this.userId = userId;
    this.source = source;
    this.value = value;
    this.audience = audience;
  }

  static generate({ userId, source, audience }) {
    const uuid = crypto.randomUUID();
    const value = [userId, uuid].filter(Boolean).join(SEPARATOR);
    return new RefreshToken({ userId, source, value, audience });
  }

  get expirationDelaySeconds() {
    return config.authentication.refreshTokenLifespanMs / 1000;
  }

  get isLegacyRefreshToken() {
    return !this.audience;
  }

  hasSameAudience(audience) {
    if (this.isLegacyRefreshToken) return true;
    return this.audience === audience;
  }
}
