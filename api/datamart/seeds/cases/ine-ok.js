import { faker } from '@faker-js/faker';

import {
  COMPETENCES,
  generateCertifCourseId,
  generateCompetenceLevel,
  generateFirstName,
  generatePixScore,
  generateStatus,
  getFormattedBirthdate,
  nationalStudentIdGenerator,
} from './tools.js';

const generateINE = nationalStudentIdGenerator({ ineSuffix: 'AA' });

/**
 * A student that has a V3 certification and that can be found by INE but not by UAI
 */
export default function () {
  const studentBase = {
    certification_courses_id: generateCertifCourseId(),
    organization_uai: null, // We do not want it to be accessible by UAI
    national_student_id: generateINE(),
    last_name: faker.person.lastName(),
    first_name: generateFirstName(),
    birthdate: getFormattedBirthdate(),
    status: generateStatus(),
    pix_score: generatePixScore(),
    certification_date: faker.date.between({ from: '2024-01-01', to: '2024-11-04' }),
  };

  return COMPETENCES.map((competence) => ({
    ...studentBase,
    ...competence,
    competence_level: generateCompetenceLevel(),
  }));
}
