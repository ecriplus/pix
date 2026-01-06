const PIX_ADMIN = {
  NOT_ALLOWED_MSG: "Vous n'avez pas les droits pour vous connecter.",
  ROLES: {
    CERTIF: 'CERTIF',
    METIER: 'METIER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    SUPPORT: 'SUPPORT',
  },
};

const PIX_ORGA = {
  ROLES: {
    ADMIN: 'ORGA_ADMIN',
  },
};

const CLIENTS = {
  SCRIPT: 'SCRIPT',
  ADMIN: 'PIX_ADMIN',
  ORGA: 'PIX_ORGA',
};

export { CLIENTS, PIX_ADMIN, PIX_ORGA };
