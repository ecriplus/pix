import { config } from '../../../shared/config.js';
import { anonymizeGeneralizeDate } from '../../../shared/infrastructure/utils/date-utils.js';

class UserLogin {
  constructor({
    id,
    userId,
    failureCount = 0,
    temporaryBlockedUntil,
    blockedAt,
    createdAt,
    updatedAt,
    lastLoggedAt,
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.failureCount = failureCount;
    this.temporaryBlockedUntil = temporaryBlockedUntil;
    this.blockedAt = blockedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoggedAt = lastLoggedAt;
  }

  incrementFailureCount() {
    this.failureCount++;
  }

  hasFailedAtLeastOnce() {
    return this.failureCount > 0 || Boolean(this.temporaryBlockedUntil);
  }

  shouldMarkUserAsTemporarilyBlocked() {
    return this.failureCount % config.login.temporaryBlockingThresholdFailureCount === 0;
  }

  shouldSendConnectionWarning() {
    if (!this.lastLoggedAt) {
      return false;
    }

    const emailConnectionWarningPeriodMs = config.login.emailConnectionWarningPeriod;
    const nowMs = new Date().getTime();

    const userLastConnexionMs = new Date(this.lastLoggedAt).getTime();
    return nowMs - userLastConnexionMs >= emailConnectionWarningPeriodMs;
  }

  markUserAsTemporarilyBlocked() {
    const commonRatio = Math.pow(2, this.failureCount / config.login.temporaryBlockingThresholdFailureCount - 1);
    this.temporaryBlockedUntil = new Date(Date.now() + config.login.temporaryBlockingBaseTimeMs * commonRatio);
  }

  isUserMarkedAsTemporaryBlocked() {
    const now = new Date();
    return this?.temporaryBlockedUntil > now;
  }

  resetUserTemporaryBlocking() {
    this.failureCount = 0;
    this.temporaryBlockedUntil = null;
  }

  shouldMarkUserAsBlocked() {
    return this.failureCount >= config.login.blockingLimitFailureCount;
  }

  markUserAsBlocked() {
    this.blockedAt = new Date();
    this.temporaryBlockedUntil = null;
  }

  isUserMarkedAsBlocked() {
    return Boolean(this.blockedAt);
  }

  resetUserBlocking() {
    this.failureCount = 0;
    this.temporaryBlockedUntil = null;
    this.blockedAt = null;
  }

  anonymize() {
    return new UserLogin({
      ...this,
      createdAt: anonymizeGeneralizeDate(this.createdAt),
      updatedAt: anonymizeGeneralizeDate(this.updatedAt),
      temporaryBlockedUntil: null,
      blockedAt: null,
      lastLoggedAt: this.lastLoggedAt && anonymizeGeneralizeDate(this.lastLoggedAt),
    });
  }
}

export { UserLogin };
