function _buildAdministrationTeam(databaseBuilder, { name }) {
  databaseBuilder.factory.buildAdministrationTeam({
    name,
  });
}

export function buildAdministrationTeams(databaseBuilder) {
  _buildAdministrationTeam(databaseBuilder, { name: 'Team Rocket' });
  _buildAdministrationTeam(databaseBuilder, { name: 'Team Alpha' });
  _buildAdministrationTeam(databaseBuilder, { name: 'Team Solo' });
}
