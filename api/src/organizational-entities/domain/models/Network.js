import { NetworkHeadOrganization } from './NetworkHeadOrganization.js';

class Network {
  constructor({ id, name, organizationId, organizationName } = {}) {
    this.id = id;
    this.name = name;
    if (organizationId && organizationName) {
      this.headOrganization = new NetworkHeadOrganization({ id: organizationId, name: organizationName });
    }
  }

  updateName(name) {
    this.name = name;
  }
}

export { Network };
