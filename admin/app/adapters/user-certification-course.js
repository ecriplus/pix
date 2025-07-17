import ApplicationAdapter from './application';

export default class UserCertificationCourseAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  urlForQuery({ userId }) {
    return `${this.host}/${this.namespace}/users/${Number(userId)}/certification-courses`;
  }
}
