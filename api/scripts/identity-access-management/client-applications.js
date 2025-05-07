import { clientApplicationRepository } from '../../src/identity-access-management/infrastructure/repositories/client-application.repository.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { cryptoService } from '../../src/shared/domain/services/crypto-service.js';

class ClientApplicationsScript extends Script {
  constructor() {
    super({
      description: 'Manage client applications',
      commands: {
        list: {
          description: 'List client applications',
        },
        add: {
          description: 'Create client application',
          options: {
            name: {
              description: 'Client application name',
              demandOption: true,
              type: 'string',
            },
            clientId: {
              description: 'Client ID',
              demandOption: true,
              type: 'string',
            },
            clientSecret: {
              description: 'Client secret',
              demandOption: true,
              type: 'string',
            },
            scope: {
              description: 'Authorized scope (repeatable)',
              demandOption: true,
              type: 'array',
            },
            jurisdiction: {
              description:
                "Jurisdiction definition, currently, only an object like `{ rules: [{ name: 'tag', value: ['tag name'] }] }` is supported",
              demandOption: true,
              type: 'object',
            },
          },
        },
        remove: {
          description: 'Remove client application',
          options: {
            clientId: {
              description: 'Client ID',
              demandOption: true,
              type: 'string',
            },
          },
        },
        addScope: {
          description: 'Add one or more scopes to client application',
          options: {
            clientId: {
              description: 'Client ID',
              demandOption: true,
              type: 'string',
            },
            scope: {
              description: 'Authorized scope (repeatable)',
              demandOption: true,
              type: 'array',
            },
          },
        },
        removeScope: {
          description: 'Remove one or more scopes from client application',
          options: {
            clientId: {
              description: 'Client ID',
              demandOption: true,
              type: 'string',
            },
            scope: {
              description: 'Authorized scope (repeatable)',
              demandOption: true,
              type: 'array',
            },
          },
        },
        setClientSecret: {
          description: 'Set client secret of client application',
          options: {
            clientId: {
              description: 'Client ID',
              demandOption: true,
              type: 'string',
            },
            clientSecret: {
              description: 'Client secret',
              demandOption: true,
              type: 'string',
            },
          },
        },
      },
      permanent: true,
    });
  }

  async handle({ command, options, logger }) {
    await this[command ?? 'list'](options, logger);
  }

  async list() {
    const list = await clientApplicationRepository.list();
    console.table(
      list.map((clientApplication) => {
        return {
          ...clientApplication,
          jurisdiction: JSON.stringify(clientApplication.jurisdiction),
        };
      }),
    );
  }

  async add({ name, clientId, clientSecret, scope: scopes, jurisdiction }, logger) {
    const hashedClientSecret = await cryptoService.hashPassword(clientSecret);
    await clientApplicationRepository.create({
      name,
      clientId,
      clientSecret: hashedClientSecret,
      scopes,
      jurisdiction,
    });
    logger.info({ clientName: name, clientId, scopes, jurisdiction }, 'client application created');
  }

  async remove({ clientId }, logger) {
    const removed = await clientApplicationRepository.removeByClientId(clientId);
    if (removed) {
      logger.info({ clientId }, 'removed one client applications');
    } else {
      logger.error('did not remove any client applications');
    }
  }

  async addScope({ clientId, scope: newScopes }, logger) {
    const udpated = await clientApplicationRepository.addScopes(clientId, newScopes);

    if (udpated) {
      logger.info({ clientId, scopes: newScopes }, 'added scopes to client application');
    } else {
      logger.error({ clientId }, 'did not find client application');
    }
  }

  async removeScope({ clientId, scope: scopesToRemove }, logger) {
    const removed = await clientApplicationRepository.removeScopes(clientId, scopesToRemove);

    if (removed) {
      logger.info({ clientId, scopes: scopesToRemove }, 'removed scopes from client application');
    } else {
      logger.error({ clientId }, 'did not find client application');
    }
  }

  async setClientSecret({ clientId, clientSecret }, logger) {
    const hashedClientSecret = await cryptoService.hashPassword(clientSecret);

    const updated = await clientApplicationRepository.setClientSecret(clientId, hashedClientSecret);

    if (updated) {
      logger.info({ clientId }, 'set client secret for client application');
    } else {
      logger.error({ clientId }, 'did not find client application');
    }
  }
}

await ScriptRunner.execute(import.meta.url, ClientApplicationsScript);
