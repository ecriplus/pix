const DEFAULT_CHUNK_SIZE = 1_000;

export async function extractTransformAndLoadData({
  replicationName,
  replicationRepository,
  datawarehouseKnex,
  datamartKnex,
}) {
  const replication = replicationRepository.getByName(replicationName);

  let context = { datawarehouseKnex, datamartKnex };

  const additionalContext = await replication.before?.(context);

  context = { ...additionalContext, ...context };

  const queryBuilder = replication.from(context);
  let chunk = [];
  let count = 0;
  const chunkSize = replication.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const connection = await datamartKnex.context.client.acquireConnection();
  try {
    for await (const data of queryBuilder.stream()) {
      chunk.push(replication.transform?.(data) ?? data);
      count += 1;
      if (chunk.length === chunkSize) {
        await replication.to(context, chunk).connection(connection);
        chunk = [];
      }
    }

    if (chunk.length) {
      await replication.to(context, chunk).connection(connection);
    }
    return { count };
  } finally {
    await datamartKnex.context.client.releaseConnection(connection);
  }
}
