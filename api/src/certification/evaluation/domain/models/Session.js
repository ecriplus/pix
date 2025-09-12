export class Session {
  constructor({ id, accessCode, finalizedAt, publishedAt } = {}) {
    this.id = id;
    this.accessCode = accessCode;
    this.isFinalized = Boolean(finalizedAt);
    this.isPublished = Boolean(publishedAt);
  }

  isAccessible() {
    if (this.isFinalized || this.isPublished) {
      return false;
    }

    return true;
  }
}
