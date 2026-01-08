async function getModuleMetadataListByIds({ ids, moduleMetadataRepository }) {
  return moduleMetadataRepository.getAllByIds({ ids });
}

export { getModuleMetadataListByIds };
