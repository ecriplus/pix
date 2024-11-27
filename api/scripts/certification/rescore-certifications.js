import 'dotenv/config';

import * as url from 'node:url';

import { disconnect } from '../../db/knex-database-connection.js';
import { CertificationRescoringByScriptJob } from '../../src/certification/session-management/domain/models/CertificationRescoringByScriptJob.js';
import { certificationRescoringByScriptJobRepository } from '../../src/certification/session-management/infrastructure/repositories/jobs/certification-rescoring-by-script-job-repository.js';
import { logger } from '../../src/shared/infrastructure/utils/logger.js';
import { parseCsv } from '../helpers/csvHelpers.js';

const modulePath = url.fileURLToPath(import.meta.url);
const isLaunchedFromCommandLine = process.argv[1] === modulePath;

/**
 * Usage: node scripts/certification/rescore-certifications.js path/file.csv
 * File has only one column of certification-courses.id (integer), no header
 **/
async function main(filePath) {
  logger.info('Reading and parsing csv data file... ');
  const certificationCourseIds = await extractCsvData(filePath);

  logger.info(`Publishing ${certificationCourseIds.length} rescoring jobs`);
  const jobs = await _scheduleRescoringJobs(certificationCourseIds);

  const errors = jobs.filter((result) => result.status === 'rejected');
  if (errors.length) {
    errors.forEach((result) => logger.error(result.reason, 'Some jobs could not be published'));
    return 1;
  }

  logger.info(`${jobs.length} jobs successfully published`);
  return 0;
}

async function extractCsvData(filePath) {
  const dataRows = await parseCsv(filePath, { header: false, skipEmptyLines: true });
  return dataRows.reduce((certificationCourseIds, dataRow) => {
    const certificationCenterId = parseInt(dataRow[0]);
    certificationCourseIds.push(certificationCenterId);
    return certificationCourseIds;
  }, []);
}

const _scheduleRescoringJobs = async (certificationCourseIds) => {
  const promisefiedJobs = certificationCourseIds.map(async (certificationCourseId) => {
    try {
      await certificationRescoringByScriptJobRepository.performAsync(
        new CertificationRescoringByScriptJob({ certificationCourseId }),
      );
    } catch (error) {
      throw new Error(`Error for certificationCourseId: [${certificationCourseId}]`, { cause: error });
    }
  });
  return Promise.allSettled(promisefiedJobs);
};

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      const filePath = process.argv[2];
      const exitCode = await main(filePath);
      return exitCode;
    } catch (error) {
      logger.error(error);
      process.exitCode = 1;
    } finally {
      await disconnect();
    }
  }
})();

export { main };
