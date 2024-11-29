import { config } from '../../../../shared/config.js';

async function findByTubes({ organizationId, apiDataDatasource }) {
  return apiDataDatasource.get(config.apiData.queries.coverRateByTubes, [
    {
      name: 'organization_id',
      value: organizationId,
    },
  ]);
}

export { findByTubes };
