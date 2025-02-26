import { DatabaseConnection } from '../../../db/database-connection.js';
import knexConfigs from '../../../db/knexfile.js';
import * as userRepository from '../../../src/identity-access-management/infrastructure/repositories/user.repository.js';
import { config } from '../../../src/shared/config.js';
import { UserNotFoundError } from '../../../src/shared/domain/errors.js';
import { databaseBuilder, expect } from '../../test-helper.js';

describe('Integration | Infrastructure | database-connection', function () {
  it('should empty all tables', async function () {
    // Increase the test timeout because the table truncate can be long to respond sometimes.
    this.timeout(5000);

    // given
    const { environment } = config;
    const databaseConnection = new DatabaseConnection(knexConfigs[environment]);

    const { id } = databaseBuilder.factory.buildUser();
    await databaseBuilder.commit();

    // when
    await databaseConnection.emptyAllTables();

    // then
    await expect(userRepository.get(id)).to.be.rejectedWith(UserNotFoundError);
  });
});
