import { knex } from '../../db/knex-database-connection.js';
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
    const clientApplications = await knex
      .select('name', 'clientId', 'scopes')
      .from('client_applications')
      .orderBy('name');
    console.table(clientApplications);
  }

  async add({ name, clientId, clientSecret, scope: scopes }, logger) {
    const hashedClientSecret = await cryptoService.hashPassword(clientSecret);
    await knex
      .insert({
        name,
        clientId,
        clientSecret: hashedClientSecret,
        scopes,
      })
      .into('client_applications');
    logger.info({ clientName: name, clientId, scopes }, 'client application created');
  }

  async remove({ clientId }, logger) {
    const rows = await knex.delete().from('client_applications').where('clientId', clientId);
    if (rows) {
      logger.info({ clientId }, 'removed one client applications');
    } else {
      logger.error('did not remove any client applications');
    }
  }

  async addScope({ clientId, scope: newScopes }, logger) {
    await knex.transaction(async (trx) => {
      const clientApplication = await trx
        .select('scopes')
        .from('client_applications')
        .where('clientId', clientId)
        .forUpdate()
        .first();

      if (!clientApplication) {
        logger.error({ clientId }, 'did not find client application');
        return false;
      }

      const scopes = new Set(clientApplication.scopes);
      newScopes.forEach((scope) => scopes.add(scope));

      await trx('client_applications')
        .update({ scopes: Array.from(scopes), updatedAt: knex.fn.now() })
        .where('clientId', clientId);
    });

    logger.info({ clientId, scopes: newScopes }, 'added scopes to client application');
  }

  async removeScope({ clientId, scope: scopesToRemove }, logger) {
    const removed = await knex.transaction(async (trx) => {
      const clientApplication = await trx
        .select('scopes')
        .from('client_applications')
        .where('clientId', clientId)
        .forUpdate()
        .first();

      if (!clientApplication) {
        logger.error({ clientId }, 'did not find client application');
        return false;
      }

      const scopes = new Set(clientApplication.scopes);
      scopesToRemove.forEach((scope) => scopes.delete(scope));

      if (!scopes.size) {
        logger.error('cannot remove all scopes on client application');
        return false;
      }

      await trx('client_applications')
        .update({ scopes: Array.from(scopes), updatedAt: knex.fn.now() })
        .where('clientId', clientId);

      return true;
    });

    if (removed) {
      logger.info({ clientId, scopes: scopesToRemove }, 'removed scopes from client application');
    }
  }

  async setClientSecret({ clientId, clientSecret }, logger) {
    const hashedClientSecret = await cryptoService.hashPassword(clientSecret);

    const rows = await knex('client_applications')
      .update({ clientSecret: hashedClientSecret, updatedAt: knex.fn.now() })
      .where('clientId', clientId);

    if (rows) {
      logger.info({ clientId }, 'set client secret for client application');
    } else {
      logger.error({ clientId }, 'did not find client application');
    }
  }
}

await ScriptRunner.execute(import.meta.url, ClientApplicationsScript);
