import { JobController } from '../../../shared/application/jobs/job-controller.js';
import { config } from '../../../shared/config.js';
import { UpdateCombineCourseJob } from '../../domain/models/UpdateCombinedCourseJob.js';
import { usecases } from '../../domain/usecases/index.js';

class UpdateCombinedCourseJobController extends JobController {
  constructor() {
    super(UpdateCombineCourseJob.name);
  }

  get isJobEnabled() {
    return config.pgBoss.updateCombinedCourseJobEnabled;
  }

  async handle({ data }) {
    const { userId, moduleId } = data;

    // TODO + déplacer les fichiers de test des job controller et repository
    const combinedCourses = await usecases.findCombinedCourseByModuleIdAndUserId({ moduleId, userId });
    for (const combinedCourse of combinedCourses) {
      await usecases.updateCombinedCourse({ userId, code: combinedCourse.code });
    }
  }
}

export { UpdateCombinedCourseJobController };
