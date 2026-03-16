export function getNetworkDetails({ networkId, networkRepository }) {
  return networkRepository.getById(networkId);
}
