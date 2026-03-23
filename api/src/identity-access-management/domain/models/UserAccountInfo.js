export const RESTRICTED_OIDC_PROVIDERS = {
  list: ['CNAV'],
};

export class UserAccountInfo {
  #addEmailConnectionMethodEnabled;
  #oidcAuthenticationMethods;

  constructor({
    id,
    email,
    username,
    canSelfDeleteAccount,
    addEmailConnectionMethodEnabled = false,
    oidcAuthenticationMethods = [],
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.canSelfDeleteAccount = canSelfDeleteAccount;
    this.#addEmailConnectionMethodEnabled = addEmailConnectionMethodEnabled;
    this.#oidcAuthenticationMethods = oidcAuthenticationMethods;
  }

  get canAddEmailConnectionMethod() {
    if (!this.#addEmailConnectionMethodEnabled) {
      return false;
    }
    if (this.email || this.#oidcAuthenticationMethods.length === 0) {
      return false;
    }
    return this.#oidcAuthenticationMethods.some(
      (method) => !RESTRICTED_OIDC_PROVIDERS.list.includes(method.identityProvider),
    );
  }
}
