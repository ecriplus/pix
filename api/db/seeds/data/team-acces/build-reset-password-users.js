function _buildUserWithShouldChangePassword(databaseBuilder) {
  databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Kaa',
    lastName: 'Reboot',
    email: 'change-password@example.net',
    username: 'kaa.reboot',
    shouldChangePassword: true,
    cgu: false,
  });
}

export function buildResetPasswordUsers(databaseBuilder) {
  _buildUserWithShouldChangePassword(databaseBuilder);
}
