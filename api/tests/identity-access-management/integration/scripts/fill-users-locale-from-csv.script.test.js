import * as url from 'node:url';

import Joi from 'joi';

import { FillUsersLocaleFromCsvScript } from '../../../../src/identity-access-management/scripts/fill-users-locale-from-csv.script.js';
import { csvFileStreamer } from '../../../../src/shared/application/scripts/parsers.js';
import { logger } from '../../../../src/shared/infrastructure/utils/logger.js';
import { databaseBuilder, expect, knex } from '../../../test-helper.js';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

describe('Integration | Identity Access Management | Scripts | fill-users-locale-from-csv', function () {
  describe('#handle', function () {
    let userIdWithoutLocale1, userIdWithoutLocale2, userIdWithLocale, streamFile;
    beforeEach(async function () {
      userIdWithoutLocale1 = databaseBuilder.factory.buildUser({ id: 1, locale: null }).id;
      userIdWithoutLocale2 = databaseBuilder.factory.buildUser({ id: 2, locale: null }).id;
      userIdWithLocale = databaseBuilder.factory.buildUser({ id: 3, locale: 'es' }).id;
      await databaseBuilder.commit();
      const csvPath = `${currentDirectory}files/fill-users-locale.csv`;
      const columnSchemas = [
        { name: 'userId', schema: Joi.number().required() },
        { name: 'locale', schema: Joi.string().required() },
      ];
      const streamer = await csvFileStreamer(columnSchemas);
      streamFile = async (cb, batchSize) => {
        const fileStream = await streamer(csvPath);
        return fileStream(cb, batchSize);
      };
    });

    it('updates only users without a locale from CSV', async function () {
      // when
      const script = new FillUsersLocaleFromCsvScript();
      await script.handle({
        options: { file: streamFile, dryRun: false, batchSize: 10, delayInMilliseconds: 0 },
        logger,
      });

      // then
      const user1 = await knex('users').where({ id: userIdWithoutLocale1 }).first();
      const user2 = await knex('users').where({ id: userIdWithoutLocale2 }).first();
      const user3 = await knex('users').where({ id: userIdWithLocale }).first();
      expect(user1.locale).to.equal('fr-FR');
      expect(user2.locale).to.equal('en');
      expect(user3.locale).to.equal('es');
    });

    it('does nothing in dryRun mode', async function () {
      // when
      const script = new FillUsersLocaleFromCsvScript();
      await script.handle({
        options: { file: streamFile, dryRun: true, batchSize: 10, delayInMilliseconds: 0 },
        logger,
      });

      // then
      const user1 = await knex('users').where({ id: userIdWithoutLocale1 }).first();
      const user2 = await knex('users').where({ id: userIdWithoutLocale2 }).first();
      expect(user1.locale).to.be.null;
      expect(user2.locale).to.be.null;
    });
  });
});
