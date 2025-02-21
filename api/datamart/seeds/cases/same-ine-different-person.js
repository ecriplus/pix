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
  orgaUAIGenerator,
} from './tools.js';

const generateINE = nationalStudentIdGenerator({ ineSuffix: 'CC' });
const generateOrgaUai = orgaUAIGenerator();

/**
 * Two different students with the same INE
 */
export default function () {
  const sameINE = generateINE();

  const studentOneBase = {
    certification_courses_id: generateCertifCourseId(),
    organization_uai: generateOrgaUai(),
    national_student_id: sameINE,
    last_name: faker.person.lastName(),
    first_name: generateFirstName(),
    birthdate: getFormattedBirthdate(), // We want different birthdate
    status: generateStatus(),
    pix_score: generatePixScore(),
    certification_date: faker.date.between({ from: '2024-01-01', to: '2024-11-04' }),
  };

  const studentTwoBase = {
    certification_courses_id: generateCertifCourseId(),
    organization_uai: generateOrgaUai(),
    national_student_id: sameINE,
    last_name: faker.person.lastName(),
    first_name: generateFirstName(),
    birthdate: getFormattedBirthdate(), // We want different birthdate
    status: generateStatus(),
    pix_score: generatePixScore(),
    certification_date: faker.date.between({ from: '2024-01-01', to: '2024-11-04' }),
  };

  return [studentOneBase, studentTwoBase].flatMap((student) => {
    return COMPETENCES.map((competence) => ({
      ...student,
      ...competence,
      competence_level: generateCompetenceLevel(),
    }));
  });
}
