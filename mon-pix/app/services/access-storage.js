import BaseStorage from './base-storage.js';

export default class AccessStorage extends BaseStorage {
  collectionName = 'access';
  #hasUserSeenJoinPageKey = 'hasUserSeenJoinPage';
  #associationDoneKey = 'associationDone';

  hasUserSeenJoinPage(organizationId) {
    return super.get(organizationId, this.#hasUserSeenJoinPageKey) ?? false;
  }

  setHasUserSeenJoinPage(organizationId) {
    super.set(organizationId, this.#hasUserSeenJoinPageKey, true);
  }

  isAssociationDone(id) {
    return super.get(id, this.#associationDoneKey) ?? false;
  }

  setAssociationDone(id) {
    super.set(id, this.#associationDoneKey, true);
  }
}
