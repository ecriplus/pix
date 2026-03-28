export interface PixBaseUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  rawPassword: string;
}

export interface PixCertifiableUserData extends PixBaseUserData {
  sex: string;
  birthdate: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  birthCountry: string;
  birthCity: string;
  postalCode: string;
}

export interface PixCertifUserData extends PixBaseUserData {
  certificationCenters: {
    type: string;
    externalId: string;
    habilitations: string[];
    withOrganization?: {
      isManagingStudents: boolean;
    };
  }[];
}

export interface PixAdminUserData extends PixBaseUserData {
  role: 'CERTIF' | 'METIER' | 'SUPER_ADMIN' | 'SUPPORT';
}
