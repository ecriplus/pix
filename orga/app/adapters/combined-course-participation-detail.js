import ApplicationAdapter from './application';

export default class CombinedCourseParticipationDetailAdapter extends ApplicationAdapter {
  urlForQueryRecord(query) {
    const combinedCourseId = query.combinedCourseId;
    const participationId = query.participationId;
    delete query.combinedCourseId;
    delete query.participationId;
    return `${this.host}/${this.namespace}/combined-courses/${combinedCourseId}/participations/${participationId}`;
  }
}
