import BaseStorage from './base-storage.js';

export default class AccessStorage extends BaseStorage {
  collectionName = 'access';
  #hasUserSeenJoinPageKey = 'hasUserSeenJoinPage';
  #associationDoneKey = 'associationDone';

  hasUserSeenJoinPage(organizationId) {
    return super.get(organizationId, this.#hasUserSeenJoinPageKey) ?? false;
  }

  setHasUserSeenJoinPage(organizationId, value) {
    super.set(organizationId, this.#hasUserSeenJoinPageKey, value);
  }

  associationDone(id) {
    return super.get(id, this.#associationDoneKey) ?? false;
  }

  setAssociationDone(id, value) {
    super.set(id, this.#associationDoneKey, value);
  }
}
