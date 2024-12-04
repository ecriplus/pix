class OrganizationFeature {
  #deleteLearner;
  constructor({ featureId, organizationId, params, deleteLearner }) {
    this.featureId = parseInt(featureId, 10);
    this.organizationId = parseInt(organizationId, 10);
    this.params = params ? JSON.parse(params) : null;

    this.#deleteLearner = deleteLearner === 'Y';
  }

  get deleteLearner() {
    return this.#deleteLearner;
  }
}

export { OrganizationFeature };
