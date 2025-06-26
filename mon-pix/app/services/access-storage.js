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

  isAssociationDone(organizationId) {
    return super.get(organizationId, this.#associationDoneKey) ?? false;
  }

  setAssociationDone(organizationId) {
    super.set(organizationId, this.#associationDoneKey, true);
  }
}
