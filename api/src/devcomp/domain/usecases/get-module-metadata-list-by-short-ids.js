async function getModuleMetadataListByShortIds({ shortIds, moduleMetadataRepository }) {
  return moduleMetadataRepository.getAllByShortIds({ shortIds });
}

export { getModuleMetadataListByShortIds };
