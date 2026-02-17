import { createReadStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AttestationStorage } from '../../src/quest/infrastructure/storage/attestation-storage.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

export class CopyAttestationsTemplatesPdfScript extends Script {
  constructor() {
    super({
      description: 'This script will copy pdf templates of attestations into a designated s3 bucket',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          default: true,
        },
      },
    });
  }

  async handle({
    options,
    logger,
    dependencies = { fs, client: AttestationStorage.createClient(), createReadStream },
  }) {
    const directoryName = dirname(fileURLToPath(import.meta.url));
    const directoryPath = join(directoryName, '../../src/profile/infrastructure/serializers/pdf/templates');
    const files = await dependencies.fs.readdir(directoryPath);

    for (const file of files) {
      const readableStream = dependencies.createReadStream(join(directoryPath, file));
      if (options.dryRun) {
        logger.info(`[DRY RUN] ${file} would have been copied to S3 bucket`);
      } else {
        await dependencies.client.startUpload({ filename: file, readableStream });
      }
    }
  }
}

await ScriptRunner.execute(import.meta.url, CopyAttestationsTemplatesPdfScript);
