import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  links(combinedCourse) {
    return {
      combinedCourseParticipations: {
        related: `/api/combined-courses/${combinedCourse.id}/participations`,
      },
    };
  },
});
