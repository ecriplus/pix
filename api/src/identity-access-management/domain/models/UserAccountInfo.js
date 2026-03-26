export class UserAccountInfo {
  #addEmailConnectionMethodEnabled;
  #oidcAuthenticationMethods;
  #restrictedOidcProvidersForEmailCreation;

  constructor({
    id,
    email,
    username,
    canSelfDeleteAccount,
    restrictedOidcProvidersForEmailCreation = [],
    addEmailConnectionMethodEnabled = false,
    oidcAuthenticationMethods = [],
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.canSelfDeleteAccount = canSelfDeleteAccount;
    this.#restrictedOidcProvidersForEmailCreation = restrictedOidcProvidersForEmailCreation;
    this.#addEmailConnectionMethodEnabled = addEmailConnectionMethodEnabled;
    this.#oidcAuthenticationMethods = oidcAuthenticationMethods;
  }

  get canAddEmailConnectionMethod() {
    if (!this.#addEmailConnectionMethodEnabled) {
      return false;
    }
    if (this.email) {
      return false;
    }
    if (this.#oidcAuthenticationMethods.length === 0) {
      return false;
    }
    if (this.#oidcAuthenticationMethods.length === 1) {
      const { identityProvider } = this.#oidcAuthenticationMethods.at(0);
      return !this.#restrictedOidcProvidersForEmailCreation.includes(identityProvider);
    }

    return true;
  }
}
