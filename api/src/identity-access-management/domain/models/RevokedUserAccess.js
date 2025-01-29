export class RevokedUserAccess {
  constructor(revokeTimeStamp) {
    this.revokeTimeStamp = revokeTimeStamp;
  }
  isAccessTokenRevoked(decodedToken) {
    const issuedAt = decodedToken.iat;
    if (!this.revokeTimeStamp) {
      return false;
    }
    return issuedAt < this.revokeTimeStamp;
  }
}
