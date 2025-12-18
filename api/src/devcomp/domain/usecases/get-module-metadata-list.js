async function getModuleMetadataList({ ids, moduleMetadataRepository }) {
  return moduleMetadataRepository.getAllByIds({ ids });
}

export { getModuleMetadataList };
