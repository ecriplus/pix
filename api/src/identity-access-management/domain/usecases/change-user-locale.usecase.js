/**
 * @param {{
 *   userId: string,
 *   language: string,
 *   locale: string,
 *   userRepository: UserRepository
 * }} params
 * @return {Promise<User>}
 */
export const changeUserLocale = async function ({ userId, language, locale, userRepository }) {
  await userRepository.update({ id: userId, lang: language, locale });
  return userRepository.getFullById(userId);
};
