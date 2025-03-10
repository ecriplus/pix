export class LtiPlatformRegistration {
  constructor({
    clientId,
    platformOrigin,
    status,
    toolConfig,
    encryptedPrivateKey,
    publicKey,
    platformOpenIdConfigUrl,
  }) {
    this.clientId = clientId;
    this.platformOrigin = platformOrigin;
    this.status = status;
    this.toolConfig = toolConfig;
    this.encryptedPrivateKey = encryptedPrivateKey;
    this.publicKey = publicKey;
    this.platformOpenIdConfigUrl = platformOpenIdConfigUrl;
    this.platformOpenIdConfig = null;
  }

  async fetchPlatformOpenIdConfig({ httpAgent }) {
    const { data: platformOpenIdConfig } = await httpAgent.get({
      url: this.platformOpenIdConfigUrl,
    });
    this.platformOpenIdConfig = platformOpenIdConfig;
  }
}
