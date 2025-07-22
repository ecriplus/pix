import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../prescription/shared/domain/constants.js';

export class CombinedCourse {
  constructor({ id, code, organizationId, name }, participation) {
    this.id = id;
    this.code = code;
    this.organizationId = organizationId;
    this.name = name;
    if (!participation) {
      this.status = CombinedCourseStatuses.NOT_STARTED;
    } else {
      this.status =
        participation.status === CombinedCourseParticipationStatuses.STARTED
          ? CombinedCourseStatuses.STARTED
          : CombinedCourseStatuses.COMPLETED;
    }
  }
}
