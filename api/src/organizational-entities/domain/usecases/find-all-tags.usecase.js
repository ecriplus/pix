/**
 * Retrieves all tags from the repository.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of tags.
 */
const findAllTags = function ({ tagRepository }) {
  return tagRepository.findAll();
};

export { findAllTags };
