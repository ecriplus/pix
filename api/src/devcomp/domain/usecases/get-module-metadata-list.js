async function getModuleMetadataList({ moduleMetadataRepository }) {
  return moduleMetadataRepository.listPublic();
}

export { getModuleMetadataList };
