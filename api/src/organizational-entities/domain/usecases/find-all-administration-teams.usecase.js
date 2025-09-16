const findAllAdministrationTeams = async function ({ administrationTeamRepository }) {
  return administrationTeamRepository.findAll();
};

export { findAllAdministrationTeams };
