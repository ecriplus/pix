import * as url from 'node:url';

import { databaseConnections } from '../../db/database-connections.js';
import { manageEmails } from '../../src/certification/session-management/domain/services/session-publication-service.js';
import * as certificationCenterRepository from '../../src/certification/shared/infrastructure/repositories/certification-center-repository.js';
import * as sharedSessionRepository from '../../src/certification/shared/infrastructure/repositories/session-repository.js';
import * as mailService from '../../src/shared/domain/services/mail-service.js';
import { logger } from '../../src/shared/infrastructure/utils/logger.js';

/**
 * Usage: LOG_LEVEL=info NODE_TLS_REJECT_UNAUTHORIZED='0' PGSSLMODE=require node scripts/certification/send-certification-result-emails.js 1234,5678,9012
 */
async function main() {
  logger.info("Début du script d'envoi d'email de resultats de certification pour une liste de session.");

  if (process.argv.length <= 2) {
    logger.info(
      'Usage: NODE_TLS_REJECT_UNAUTHORIZED="0" PGSSLMODE=require node scripts/certification/send-certification-result-emails.js 1234,5678,9012',
    );
    return;
  }

  const sessionIds = process.argv[2].split(',');
  let successes = 0;

  for (const sessionId of sessionIds) {
    let session;

    try {
      session = await sharedSessionRepository.getWithCertificationCandidates({ id: parseInt(sessionId) });
    } catch (e) {
      logger.error({ e });
      continue;
    }

    if (!session.isPublished()) {
      logger.error(`La session ${sessionId} n'est pas publiée`);
      continue;
    }

    const publishedAt = session.publishedAt;

    try {
      await manageEmails({
        session,
        publishedAt,
        certificationCenterRepository,
        sharedSessionRepository,
        dependencies: { mailService },
      });

      successes++;
    } catch (e) {
      logger.error(e);
    }
  }

  logger.info(`Nombre de session traitées: ${successes}/${sessionIds.length}`);
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
    }
  }
})();
