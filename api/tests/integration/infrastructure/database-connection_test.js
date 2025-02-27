import datamartKnexConfigs from '../../../datamart/knexfile.js';
import datawarehouseKnexConfigs from '../../../datawarehouse/knexfile.js';
import { DatabaseConnection } from '../../../db/database-connection.js';
import liveKnexConfigs from '../../../db/knexfile.js';
import * as userRepository from '../../../src/identity-access-management/infrastructure/repositories/user.repository.js';
import { config } from '../../../src/shared/config.js';
import { UserNotFoundError } from '../../../src/shared/domain/errors.js';
import { databaseBuilder, expect } from '../../test-helper.js';

describe('Integration | Infrastructure | database-connection', function () {
  describe('#emptyAllTables', function () {
    it('should empty all tables', async function () {
      // Increase the test timeout because the table truncate can be long to respond sometimes.
      this.timeout(5000);

      // given
      const { environment } = config;
      const databaseConnection = new DatabaseConnection(liveKnexConfigs[environment]);

      const { id } = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      await databaseConnection.emptyAllTables();

      // then
      await expect(userRepository.get(id)).to.be.rejectedWith(UserNotFoundError);
    });
  });

  describe('#prepare', function () {
    it('should ensure database connection is established', async function () {
      // given
      const { environment } = config;
      const liveDatabaseConnection = new DatabaseConnection(liveKnexConfigs[environment]);
      const datamartDatabaseConnection = new DatabaseConnection(datamartKnexConfigs[environment]);
      const datawarehouseDatabaseConnection = new DatabaseConnection(datawarehouseKnexConfigs[environment]);

      // when
      await expect(liveDatabaseConnection.prepare()).to.be.fulfilled;
      await expect(datamartDatabaseConnection.prepare()).to.be.fulfilled;
      await expect(datawarehouseDatabaseConnection.prepare()).to.be.fulfilled;
    });
  });
});
