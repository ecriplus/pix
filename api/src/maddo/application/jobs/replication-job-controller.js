import { knex as datamartKnex } from '../../../../datamart/knex-database-connection.js';
import { knex as datawarehouseKnex } from '../../../../datawarehouse/knex-database-connection.js';
import { JobController, JobGroup } from '../../../shared/application/jobs/job-controller.js';
import { ReplicationJob } from '../../domain/models/ReplicationJob.js';
import { extractTransformAndLoadData } from '../../domain/usecases/extract-transform-and-load-data.js';
import * as replicationRepository from '../../infrastructure/repositories/replication-repository.js';

export class ReplicationJobController extends JobController {
  constructor() {
    super(ReplicationJob.name, { jobGroup: JobGroup.MADDO });
  }

  async handle({
    data: { replicationName },
    dependencies = { extractTransformAndLoadData, replicationRepository, datamartKnex, datawarehouseKnex },
  }) {
    const { extractTransformAndLoadData, replicationRepository, datamartKnex, datawarehouseKnex } = dependencies;
    await extractTransformAndLoadData({
      replicationName,
      replicationRepository,
      datamartKnex,
      datawarehouseKnex,
    });
  }
}
