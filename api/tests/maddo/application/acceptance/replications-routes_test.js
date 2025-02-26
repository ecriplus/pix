import { replications } from '../../../../src/maddo/infrastructure/repositories/replication-repository.js';
import {
  createMaddoServer,
  datamartKnex,
  datawarehouseKnex,
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
} from '../../../test-helper.js';

describe('Maddo | Application | Acceptance | Replications', function () {
  describe('POST /api/replications/{replication}', function () {
    let server;

    beforeEach(async function () {
      const schema = (t) => {
        t.string('firstName').notNullable();
        t.string('lastName').notNullable();
      };
      await datawarehouseKnex.schema.dropTableIfExists('to-replicate');
      await datawarehouseKnex.schema.createTable('to-replicate', schema);
      await datamartKnex.schema.dropTableIfExists('replication');
      await datamartKnex.schema.createTable('replication', schema);
      server = await createMaddoServer();
    });

    it('should run given replication', async function () {
      // given
      const replication = 'my-replication';
      await datawarehouseKnex('to-replicate').insert([
        { firstName: 'first1', lastName: 'last1' },
        { firstName: 'first2', lastName: 'last2' },
      ]);

      replications.push({
        name: 'my-replication',
        from: ({ datawarehouseKnex }) => {
          return datawarehouseKnex('to-replicate').select('*');
        },
        to: ({ datamartKnex }, chunk) => {
          return datamartKnex('replication').insert(chunk);
        },
      });

      // when
      const response = await server.inject({
        method: 'POST',
        url: `/api/replications/${replication}?async=false`,
        headers: {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            'pix-client',
            'pix-client',
            'replication',
          ),
        },
      });

      // then
      expect(response.statusCode).to.equal(204);
      const { count } = await datamartKnex('replication').count().first();
      expect(count).to.equal(2);
    });
  });
});
