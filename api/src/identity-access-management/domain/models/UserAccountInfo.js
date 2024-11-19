export class UserAccountInfo {
  constructor({ id, email, username, canSelfDeleteAccount } = {}) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.canSelfDeleteAccount = canSelfDeleteAccount;
  }
}
