export class InvitationError extends Error {
  constructor(code = 'INVITATION_INVALID') {
    super();
    this.code = code;
  }
}

export class AuthorizationError extends Error {
  constructor(code = 'PIX_ORGA_ACCESS_NOT_ALLOWED') {
    super();
    this.code = code;
  }
}
