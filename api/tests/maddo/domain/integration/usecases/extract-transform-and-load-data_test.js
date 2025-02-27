import _ from 'lodash';

import { extractTransformAndLoadData } from '../../../../../src/maddo/domain/usecases/extract-transform-and-load-data.js';
import { datamartKnex, datawarehouseKnex, expect } from '../../../../test-helper.js';

describe('Maddo | Domain | Usecases | Integration | extract-transform-and-load-data', function () {
  beforeEach(async function () {
    const schema = (t) => {
      t.string('firstName').notNullable();
      t.string('lastName').notNullable();
    };
    await datawarehouseKnex.schema.dropTableIfExists('to-replicate');
    await datawarehouseKnex.schema.createTable('to-replicate', schema);
    await datamartKnex.schema.dropTableIfExists('replication');
    await datamartKnex.schema.createTable('replication', schema);
  });

  it('should run given replication', async function () {
    // given
    const replication = {
      name: 'my-replication',
      before: async ({ datamartKnex }) => {
        await datamartKnex('replication').delete();
      },
      from: ({ datawarehouseKnex }) => {
        return datawarehouseKnex('to-replicate').select('*');
      },
      transform: ({ firstName, lastName }) => ({
        firstName: _.capitalize(firstName),
        lastName: _.capitalize(lastName),
      }),
      to: ({ datamartKnex }, chunk) => {
        return datamartKnex('replication').insert(chunk);
      },
    };
    await datamartKnex('replication').insert([
      { firstName: 'oldfirst1', lastName: 'oldlast1' },
      { firstName: 'oldfirst2', lastName: 'oldlast2' },
    ]);
    await datawarehouseKnex('to-replicate').insert([
      { firstName: 'first1', lastName: 'last1' },
      { firstName: 'first2', lastName: 'last2' },
    ]);

    // when
    await extractTransformAndLoadData({ replication, datamartKnex, datawarehouseKnex });

    // then
    const results = await datamartKnex.select().from('replication').orderBy('firstName');
    expect(results).to.deep.equal([
      { firstName: 'First1', lastName: 'Last1' },
      { firstName: 'First2', lastName: 'Last2' },
    ]);
  });
});
