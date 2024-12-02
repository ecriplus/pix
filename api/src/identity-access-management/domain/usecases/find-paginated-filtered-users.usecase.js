const findPaginatedFilteredUsers = function ({ filter, page, queryType, userRepository }) {
  return userRepository.findPaginatedFiltered({ filter, page, queryType });
};

export { findPaginatedFilteredUsers };
