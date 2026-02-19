class OrganizationLearnerType {
  /**
   * @param {object} params
   * @param {number} params.id
   * @param {string} params.name
   */
  constructor({ id, name } = {}) {
    this.id = id;
    this.name = name;
  }
}

export { OrganizationLearnerType };
