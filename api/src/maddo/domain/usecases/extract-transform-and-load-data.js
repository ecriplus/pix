const DEFAULT_CHUNK_SIZE = 1_000;

export async function extractTransformAndLoadData({
  replicationName,
  replicationRepository,
  datawarehouseKnex,
  datamartKnex,
}) {
  const replication = replicationRepository.getByName(replicationName);

  let context = { datawarehouseKnex, datamartKnex };

  const additionnalContext = await replication.before?.(context);

  context = { ...additionnalContext, ...context };

  const queryBuilder = replication.from(context);
  let chunk = [];
  const chunkSize = replication.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const connection = await datamartKnex.context.client.acquireConnection();
  try {
    for await (const data of queryBuilder.stream()) {
      chunk.push(replication.transform?.(data) ?? data);
      if (chunk.length === chunkSize) {
        await replication.to(context, chunk).connection(connection);
        chunk = [];
      }
    }

    if (chunk.length) {
      await replication.to(context, chunk).connection(connection);
    }
  } finally {
    await datamartKnex.context.client.releaseConnection(connection);
  }
}
