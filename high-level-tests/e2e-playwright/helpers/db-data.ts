export const PIX_APP_USER_DATA = {
  id: 1_000_001,
  firstName: 'PixApp',
  lastName: 'User',
  email: 'pix-app_user@example.net',
  rawPassword: 'pix123',
};

export const PIX_ORGA_ADMIN_DATA = {
  id: 1_000_002,
  firstName: 'Adi',
  lastName: 'Minh',
  email: 'admin-orga@example.net',
  rawPassword: 'pix123',
  role: 'ADMIN',
  organizations: [
    {
      type: 'PRO',
      isManagingStudents: false,
      externalId: 'PRO',
    },
    { type: 'SCO', isManagingStudents: true, identityProviderForCampaigns: 'GAR', externalId: 'SCO_MANAGING' },
    {
      type: 'SUP',
      isManagingStudents: true,
      externalId: 'SUP_MANAGING',
    },
  ],
};

export const PIX_ORGA_MEMBER_DATA = {
  id: 1_000_003,
  firstName: 'Justin',
  lastName: 'Memberr',
  email: 'pix-orga_member@example.net',
  role: 'MEMBER',
  rawPassword: 'pix123',
  organizations: [
    {
      type: 'PRO',
      isManagingStudents: false,
      externalId: 'PRO',
    },
    { type: 'SCO', isManagingStudents: true, identityProviderForCampaigns: 'GAR', externalId: 'SCO_MANAGING' },
    {
      type: 'SUP',
      isManagingStudents: true,
      externalId: 'SUP_MANAGING',
    },
  ],
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
