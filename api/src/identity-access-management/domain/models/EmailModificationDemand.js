class EmailModificationDemand {
  constructor({ code, newEmail, action, password } = {}) {
    this.code = code;
    this.newEmail = newEmail;
    this.action = action;
    this.password = password;
  }
}

export { EmailModificationDemand };
