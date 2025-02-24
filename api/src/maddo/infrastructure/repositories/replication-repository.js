export const replications = [];

export function getByName(name, dependencies = { replications }) {
  return dependencies.replications.find((replication) => replication.name === name);
}
