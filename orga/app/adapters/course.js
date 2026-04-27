import ApplicationAdapter from './application';

export default class CourseAdapter extends ApplicationAdapter {
  urlForFindAll(modelName, { adapterOptions }) {
    const { organizationId } = adapterOptions;
    return `${this.host}/${this.namespace}/organizations/${organizationId}/courses`;
  }
}
