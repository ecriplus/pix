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

const generateINE = nationalStudentIdGenerator({ ineSuffix: 'BB' });
const generateOrgaUai = orgaUAIGenerator();

/**
 * Some student have obtained a Pix certification, but with different birthdates
 * This generates a conflict when looking for a student's certification by INE (one result possible)
 * The birthdate is one of the three elements that identifies a student
 */
export default function () {
  const sameINE = generateINE();
  const sameUAI = generateOrgaUai();
  const sameFirstName = generateFirstName();
  const sameLastName = faker.person.lastName();

  const studentOneBase = {
    certification_courses_id: generateCertifCourseId(),
    organization_uai: sameUAI,
    national_student_id: sameINE,
    last_name: sameLastName,
    first_name: sameFirstName,
    birthdate: getFormattedBirthdate(), // We want different birthdate
    status: generateStatus(),
    pix_score: generatePixScore(),
    certification_date: faker.date.between({ from: '2024-01-01', to: '2024-11-04' }),
  };

  const studentTwoBase = {
    certification_courses_id: generateCertifCourseId(),
    organization_uai: sameUAI,
    national_student_id: sameINE,
    last_name: sameLastName,
    first_name: sameFirstName,
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
