const getFrameworks = async function ({ sharedFrameworkRepository }) {
  return sharedFrameworkRepository.list();
};

export { getFrameworks };
