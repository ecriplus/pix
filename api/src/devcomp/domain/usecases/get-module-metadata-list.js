async function getModuleMetadataList({ moduleMetadataRepository }) {
  return moduleMetadataRepository.list();
}

export { getModuleMetadataList };
