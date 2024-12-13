import 'dotenv/config';

import { usecases } from '../../src/legal-documents/domain/usecases/index.js';
import { isoDateParser } from '../../src/shared/application/scripts/parsers.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

export class AddNewLegalDocumentVersion extends Script {
  constructor() {
    super({
      description: 'Adds a new legal document version.',
      permanent: true,
      options: {
        type: {
          type: 'string',
          describe: 'Type of document (ex: "TOS", "PDP")',
          demandOption: true,
          requiresArg: true,
        },
        service: {
          type: 'string',
          describe: 'Associated service (ex: "pix-app", "pix-orga",...)',
          demandOption: true,
          requiresArg: true,
        },
        versionAt: {
          type: 'string',
          describe: 'Version date of the legal document, format "YYYY-MM-DD", (ex: "2020-02-27")',
          demandOption: true,
          requiresArg: true,
          coerce: isoDateParser(),
        },
      },
    });
  }

  async handle({ options, logger }) {
    let { type, service } = options;
    const { versionAt } = options;

    type = type.trim();
    service = service.trim();

    logger.info(`Adding new legal document for type:${type}, service:${service}, versionAt:${versionAt}`);

    await usecases.createLegalDocument({ type, service, versionAt });
    logger.info(`New legal document for type:${type}, service:${service}, versionAt:${versionAt} added successfully.`);
  }
}

await ScriptRunner.execute(import.meta.url, AddNewLegalDocumentVersion);
