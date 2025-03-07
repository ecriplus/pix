export class LtiPlatformRegistration {
  constructor({ clientId, platformOrigin, status, toolConfig, encryptedPrivateKey, publicKey, platformOpenIdConfig }) {
    this.clientId = clientId;
    this.platformOrigin = platformOrigin;
    this.status = status;
    this.toolConfig = toolConfig;
    this.encryptedPrivateKey = encryptedPrivateKey;
    this.publicKey = publicKey;
    this.platformOpenIdConfig = platformOpenIdConfig;
  }
}
