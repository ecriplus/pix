class Session {
  constructor({ id, finalizedAt, publishedAt } = {}) {
    this.id = id;
    this.isFinalized = Boolean(finalizedAt);
    this.isPublished = Boolean(publishedAt);
  }
}

export { Session };
