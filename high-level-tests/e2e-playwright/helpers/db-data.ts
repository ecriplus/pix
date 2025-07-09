export const PIX_APP_USER_DATA = {
  id: 1_000_001,
  firstName: 'PixApp',
  lastName: 'User',
  email: 'pix-app_user@example.net',
  rawPassword: 'pix123',
};

export const PIX_ORGA_PRO_DATA = {
  id: 1_000_002,
  firstName: 'PixOrga',
  lastName: 'ProPrescripteur',
  email: 'pix-orga_pro-prescripteur@example.net',
  rawPassword: 'pix123',
  organization: {
    type: 'PRO',
    isManagingStudents: false,
    externalId: 'ORGAPRO',
  },
};

export const PIX_ORGA_SCO_ISMANAGING_DATA = {
  id: 1_000_003,
  firstName: 'PixOrga',
  lastName: 'ScoIsManagingPrescripteur',
  email: 'pix-orga_sco-is-managing-prescripteur@example.net',
  rawPassword: 'pix123',
  organization: {
    type: 'SCO',
    isManagingStudents: true,
    identityProviderForCampaigns: 'GAR',
    externalId: 'ORGASCOISMANAGING',
  },
};

export const PIX_ORGA_SUP_ISMANAGING_DATA = {
  id: 1_000_004,
  firstName: 'PixOrga',
  lastName: 'SupIsManagingPrescripteur',
  email: 'pix-orga_sup-is-managing-prescripteur@example.net',
  rawPassword: 'pix123',
  organization: {
    type: 'SUP',
    isManagingStudents: true,
    externalId: 'ORGASUPISMANAGING',
  },
};

export const PIX_CERTIF_PRO_DATA = {
  id: 1_000_005,
  firstName: 'PixOrga',
  lastName: 'SupIsManagingPrescripteur',
  email: 'pix-certif_pro@example.net',
  rawPassword: 'pix123',
  certificationCenter: {
    type: 'PRO',
    externalId: 'CERTIFPRO',
  },
};
