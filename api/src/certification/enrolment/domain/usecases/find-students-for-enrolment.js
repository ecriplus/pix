import { StudentForEnrolment } from '../read-models/StudentForEnrolment.js';

const findStudentsForEnrolment = async function ({
  certificationCenterId,
  sessionId,
  page,
  filter,
  centerRepository,
  organizationLearnerRepository,
  certificationCandidateRepository,
}) {
  const organizationId = await centerRepository.findActiveScoOrganizationId({ certificationCenterId });

  if (!organizationId) {
    return _emptyResponse(page);
  }

  const paginatedStudents = await organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
    page,
    filter,
    organizationId,
  });
  const certificationCandidates = await certificationCandidateRepository.findBySessionId(sessionId);
  return {
    data: _buildStudentsForEnrolment({ students: paginatedStudents.data, certificationCandidates }),
    pagination: paginatedStudents.pagination,
  };
};

export { findStudentsForEnrolment };

function _buildStudentsForEnrolment({ students, certificationCandidates }) {
  return students.map((student) =>
    StudentForEnrolment.fromStudentsAndCertificationCandidates({ student, certificationCandidates }),
  );
}

function _emptyResponse(page) {
  return {
    data: [],
    pagination: { page: page.number, pageSize: page.size, rowCount: 0, pageCount: 0 },
  };
}
