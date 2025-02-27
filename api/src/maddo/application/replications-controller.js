import { ReplicationJob } from '../domain/models/ReplicationJob.js';
import { replicationJobRepository } from '../infrastructure/repositories/jobs/replication-job-repository.js';
import * as replicationRepository from '../infrastructure/repositories/replication-repository.js';

export async function replicate(
  request,
  h,
  dependencies = {
    replicationRepository,
    replicationJobRepository,
  },
) {
  const { replicationRepository, replicationJobRepository } = dependencies;
  const { replicationName } = request.params;

  const replication = replicationRepository.getByName(replicationName);

  if (!replication) {
    return h.response().code(404);
  }

  await replicationJobRepository.performAsync(new ReplicationJob({ replicationName }));

  return h.response().code(204);
}
