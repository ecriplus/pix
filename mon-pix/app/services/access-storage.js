import BaseStorage from './base-storage.js';

export default class AccessStorage extends BaseStorage {
  collectionName = 'access';
  #hasUserSeenJoinPageKey = 'hasUserSeenJoinPage';

  hasUserSeenJoinPage(organizationId) {
    return super.get(organizationId, this.#hasUserSeenJoinPageKey) ?? false;
  }

  setHasUserSeenJoinPage(organizationId, value) {
    super.set(organizationId, this.#hasUserSeenJoinPageKey, value);
  }
}
