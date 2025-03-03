import { faker } from '@faker-js/faker';

import { logger } from '../../src/shared/infrastructure/utils/logger.js';
import caseINEok from './cases/ine-ok.js';
import caseSameINEDifferentPerson from './cases/same-ine-different-person.js';
import caseSamePersonDifferentBirthdate from './cases/same-person-different-birthdate.js';
import caseSpecialNames from './cases/special-names.js';
import caseUAIok from './cases/uai-ok.js';
import caseVerificationCodeOK from './cases/verification-code-only.js';

const NUMBER_OF_SEEDS = Number(process.env.DATAMART_NUMBER_OF_SEEDS) || 100;

const insertScoDatamart = async (knex) => {
  const scoDatamart = 'data_export_parcoursup_certif_result';

  logger.info('Start Case 1 : INE ok');
  await _chunkify({ numberOfSeeds: NUMBER_OF_SEEDS, knex, datamart: scoDatamart, generateFn: caseINEok });

  logger.info('Start Case 2 : UAI ok');
  await _chunkify({ numberOfSeeds: NUMBER_OF_SEEDS, knex, datamart: scoDatamart, generateFn: caseUAIok });

  logger.info('Start Case 3 : Same INE different persons');
  await _chunkify({
    numberOfSeeds: NUMBER_OF_SEEDS,
    knex,
    datamart: scoDatamart,
    generateFn: caseSameINEDifferentPerson,
  });

  logger.info('Start Case 4 : Same person but different birthdate');
  await _chunkify({
    numberOfSeeds: NUMBER_OF_SEEDS,
    knex,
    datamart: scoDatamart,
    generateFn: caseSamePersonDifferentBirthdate,
  });

  logger.info('Start Case 5 : Complicated names (accents, dashes');
  await _chunkify({ numberOfSeeds: NUMBER_OF_SEEDS, knex, datamart: scoDatamart, generateFn: caseSpecialNames });
};

const insertGeneralPublicDatamart = async (knex) => {
  logger.info('Start Case 6 : Verification code OK');
  const generalPublicDatamart = 'data_export_parcoursup_certif_result_code_validation';
  await _chunkify({
    numberOfSeeds: NUMBER_OF_SEEDS,
    knex,
    datamart: generalPublicDatamart,
    generateFn: caseVerificationCodeOK,
  });
};

export async function seed(knex) {
  await insertScoDatamart(knex);
  await insertGeneralPublicDatamart(knex);
}

const _chunkify = async ({ numberOfSeeds, knex, datamart, generateFn }) => {
  const chunkSize = 100;
  let remaining = numberOfSeeds;
  do {
    await knex.batchInsert(datamart, faker.helpers.multiple(generateFn, { count: chunkSize }).flat());
    remaining = remaining - chunkSize;
  } while (remaining / chunkSize >= 1);
};
