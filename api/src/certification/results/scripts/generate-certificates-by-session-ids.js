import 'dotenv/config';

import fs from 'node:fs';

import lodash from 'lodash';

const { isEmpty, compact } = lodash;
import path from 'node:path';
import * as url from 'node:url';

import i18n from 'i18n';

import { databaseConnections } from '../../../../db/database-connections.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { learningContentCache as cache } from '../../../shared/infrastructure/caches/learning-content-cache.js';
import { options } from '../../../shared/infrastructure/plugins/i18n.js';
import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { PromiseUtils } from '../../../shared/infrastructure/utils/promise-utils.js';
import * as certificationCourseRepository from '../../shared/infrastructure/repositories/certification-course-repository.js';
import * as certificateRepository from '../infrastructure/repositories/certificate-repository.js';
import * as v2CertificationAttestationPdf from '../infrastructure/utils/pdf/generate-v2-pdf-certificate.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const directory = path.resolve(path.join(__dirname, '../../../../translations'));
i18n.configure({
  ...options,
  directory,
});

/**
 * Avant de lancer le script, remplacer la variable DATABASE_URL par l'url de la base de réplication
 * Usage: LOG_LEVEL=info NODE_TLS_REJECT_UNAUTHORIZED='0' PGSSLMODE=require node scripts/certification/generate-certificates-by-session-ids.js 86781
 */
async function main() {
  logger.info('Début du script de génération de certificats pour une session.');

  if (process.argv.length <= 2) {
    logger.info(
      'Usage: NODE_TLS_REJECT_UNAUTHORIZED="0" PGSSLMODE=require node scripts/generate-certificates-by-session-id.js 1234,5678,9012',
    );
    return;
  }

  const sessionIds = process.argv[2].split(',');

  for (const sessionId of sessionIds) {
    const certificationCourses = await certificationCourseRepository.findCertificationCoursesBySessionId({ sessionId });

    if (isEmpty(certificationCourses)) {
      logger.error(`Pas de certifications trouvées pour la session ${sessionId}.`);
      continue;
    }

    const certificates = compact(
      await PromiseUtils.mapSeries(certificationCourses, async (certificationCourse) => {
        try {
          return await certificateRepository.getCertificate({
            certificationCourseId: certificationCourse.getId(),
          });
        } catch (error) {
          if (!(error instanceof NotFoundError)) {
            throw error;
          }
        }
      }),
    );

    if (isEmpty(certificates)) {
      logger.error(`Pas de certificat trouvé pour la session ${sessionId}.`);
      continue;
    }

    logger.info(`${certificates.length} certificats récupérées pour la session ${sessionId}.`);

    const { buffer } = await v2CertificationAttestationPdf.generate({
      certificates,
      i18n,
    });

    const filename = `certificats-pix-session-${sessionId}.pdf`;
    logger.info(`Génération du fichier pdf ${filename}.`);

    await fs.promises.writeFile(filename, buffer);
  }

  logger.info('Fin du script.');
}

const modulePath = url.fileURLToPath(import.meta.url);
const isLaunchedFromCommandLine = process.argv[1] === modulePath;
(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main();
    } catch (error) {
      logger.error(error);
      process.exitCode = 1;
    } finally {
      await databaseConnections.disconnect();
      await cache.quit();
    }
  }
})();
