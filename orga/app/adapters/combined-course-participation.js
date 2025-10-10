import ApplicationAdapter from './application';

export default class CombinedCourseParticipationAdapter extends ApplicationAdapter {
  urlForQuery(query) {
    const combinedCourseId = query.combinedCourseId;
    delete query.combinedCourseId;
    return `${this.host}/${this.namespace}/combined-courses/${combinedCourseId}/participations`;
  }
}
