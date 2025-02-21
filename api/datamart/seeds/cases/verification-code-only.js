import { faker } from '@faker-js/faker';

import {
  COMPETENCES,
  generateCertifCourseId,
  generateCompetenceLevel,
  generateFirstName,
  generatePixScore,
  generateStatus,
  getFormattedBirthdate,
  verificationCodeGenerator,
} from './tools.js';

const generateVerificationCode = verificationCodeGenerator();

/**
 * A person that has a certification not linked to an INE or UAI
 */
export default function () {
  const studentBase = {
    certification_courses_id: generateCertifCourseId(),
    certification_code_verification: generateVerificationCode(),
    organization_uai: null,
    national_student_id: null,
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
