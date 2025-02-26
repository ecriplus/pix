import { datamartKnex } from '../../../datamart/knex-database-connection.js';
import { logger } from '../../shared/infrastructure/utils/logger.js';
import { extractTransformAndLoadData } from '../domain/usecases/extract-transform-and-load-data.js';
import * as replicationRepository from '../infrastructure/repositories/replication-repository.js';

export async function replicate(
  request,
  h,
  dependencies = {
    extractTransformAndLoadData,
    replicationRepository,
    datamartKnex: datamartKnex,
    datawarehouseKnex: datamartKnex,
    logger,
  },
) {
  const { replicationName } = request.params;

  const replication = dependencies.replicationRepository.getByName(replicationName);

  if (!replication) {
    return h.response().code(404);
  }

  const promise = dependencies
    .extractTransformAndLoadData({
      replication,
      datamartKnex: dependencies.datamartKnex,
      datawarehouseKnex: dependencies.datawarehouseKnex,
    })
    .catch((err) =>
      dependencies.logger.error(
        {
          event: 'replication',
          err,
        },
        'Error during replication',
      ),
    );

  if (!request.query.async) {
    await promise;
  }

  return h.response().code(204);
}
