import { datamartBuffer } from '../datamart-buffer.js';

const defaultConfiguration = [
  {
    bounds: {
      max: -2.057605743408203,
      min: -5.2880120277404785,
    },
    meshLevel: 0,
  },
  {
    bounds: {
      max: -0.8657253384590149,
      min: -2.057605743408203,
    },
    meshLevel: 1,
  },
  {
    bounds: {
      max: 0.21114814281463623,
      min: -0.8657253384590149,
    },
    meshLevel: 2,
  },
  {
    bounds: {
      max: 1.363850176334381,
      min: 0.21114814281463623,
    },
    meshLevel: 3,
  },
  {
    bounds: {
      max: 2.1538760662078857,
      min: 1.363850176334381,
    },
    meshLevel: 4,
  },
  {
    bounds: {
      max: 2.9134634733200073,
      min: 2.1538760662078857,
    },
    meshLevel: 5,
  },
  {
    bounds: {
      max: 3.506680727005005,
      min: 2.9134634733200073,
    },
    meshLevel: 6,
  },
  {
    bounds: {
      max: 6.269038200378418,
      min: 3.506680727005005,
    },
    meshLevel: 7,
  },
];

const buildCertificationResult = function ({
  nationalStudentId,
  organizationUai,
  lastName,
  firstName,
  birthdate,
  status,
  pixScore,
  certificationDate,
  competenceCode,
  competenceName,
  competenceLevel,
  areaName,
  configuration = defaultConfiguration,
} = {}) {
  const values = {
    national_student_id: nationalStudentId,
    organization_uai: organizationUai,
    last_name: lastName,
    first_name: firstName,
    birthdate,
    status,
    pix_score: pixScore,
    certification_date: certificationDate,
    competence_code: competenceCode,
    competence_name: competenceName,
    competence_level: competenceLevel,
    area_name: areaName,
    configuration: JSON.stringify(configuration),
  };

  datamartBuffer.pushInsertable({
    tableName: 'sco_certification_results',
    values,
  });

  return {
    nationalStudentId,
  };
};

export { buildCertificationResult };
