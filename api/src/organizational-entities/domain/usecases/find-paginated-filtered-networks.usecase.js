const findPaginatedFilteredNetworks = async function ({ filter, page, networkRepository }) {
  return networkRepository.findPaginatedFiltered({ filter, page });
};

export { findPaginatedFilteredNetworks };
