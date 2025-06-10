import dayjs from 'dayjs';

import { OrganizationLearnerLoggerContext } from '../../../shared/domain/constants.js';

const STATUS = {
  STUDENT: 'ST',
  APPRENTICE: 'AP',
};
class OrganizationLearner {
  #loggerContext;

  constructor({
    id,
    lastName,
    preferredLastName,
    firstName,
    middleName,
    thirdName,
    sex = null,
    birthdate,
    birthCity,
    birthCityCode,
    birthProvinceCode,
    birthCountryCode,
    MEFCode,
    status,
    nationalStudentId,
    division,
    isDisabled,
    createdAt,
    updatedAt,
    userId,
    organizationId,
    isCertifiable,
    certifiableAt,
    email,
    studentNumber,
    department,
    educationalTeam,
    group,
    diploma,
    nationalApprenticeId,
    deletedAt,
    deletedBy,
    attributes,
  } = {}) {
    this.id = id;
    this.lastName = lastName;
    this.preferredLastName = preferredLastName;
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.sex = sex;
    this.birthdate = birthdate;
    this.birthCity = birthCity;
    this.birthCityCode = birthCityCode;
    this.birthProvinceCode = birthProvinceCode;
    this.birthCountryCode = birthCountryCode;
    this.MEFCode = MEFCode;
    this.status = status;
    this.nationalStudentId = nationalStudentId;
    this.division = division;
    this.isDisabled = isDisabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.organizationId = organizationId;
    this.isCertifiable = isCertifiable;
    this.certifiableAt = certifiableAt;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.email = email;
    this.studentNumber = studentNumber;
    this.department = department;
    this.educationalTeam = educationalTeam;
    this.group = group;
    this.diploma = diploma;
    this.nationalApprenticeId = nationalApprenticeId;
    this.attributes = attributes;
  }

  get loggerContext() {
    return this.#loggerContext;
  }

  updateCertificability(placementProfile) {
    this.certifiableAt = placementProfile.profileDate;
    this.isCertifiable = placementProfile.isCertifiable();
  }

  anonymize() {
    this.#loggerContext = OrganizationLearnerLoggerContext.ANONYMIZATION;
    this.firstName = '(anonymized)';
    this.lastName = '(anonymized)';
    this.preferredLastName = null;
    this.middleName = null;
    this.thirdName = null;

    if (this.birthdate) {
      const birthdate = dayjs(this.birthdate).set('date', 1).set('month', 0).format('YYYY-MM-DD');
      this.birthdate = birthdate;
    }

    this.birthCity = null;
    this.birthCityCode = null;
    this.birthProvinceCode = null;
    this.birthCountryCode = null;
    this.status = null;
    this.nationalStudentId = null;
    this.nationalApprenticeId = null;
    this.division = null;
    this.sex = null;
    this.email = null;
    this.studentNumber = null;
    this.department = null;
    this.educationalTeam = null;
    this.group = null;
    this.diploma = null;
    this.detachUser();
  }

  detachUser() {
    this.userId = null;
    this.updatedAt = new Date();
  }

  delete(userId, isAnonymizedWithDeletionEnabled) {
    if (isAnonymizedWithDeletionEnabled) {
      this.anonymize();
      this.#loggerContext = OrganizationLearnerLoggerContext.DELETION;
    }

    this.deletedAt = new Date();
    this.updatedAt = this.deletedAt;
    this.deletedBy = userId;
  }

  get dataToUpdateOnDeletion() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      preferredLastName: this.preferredLastName,
      middleName: this.middleName,
      thirdName: this.thirdName,
      birthdate: this.birthdate,
      birthCity: this.birthCity,
      birthCityCode: this.birthCityCode,
      birthProvinceCode: this.birthProvinceCode,
      birthCountryCode: this.birthCountryCode,
      status: this.status,
      nationalStudentId: this.nationalStudentId,
      nationalApprenticeId: this.nationalApprenticeId,
      division: this.division,
      sex: this.sex,
      email: this.email,
      studentNumber: this.studentNumber,
      department: this.department,
      educationalTeam: this.educationalTeam,
      group: this.group,
      diploma: this.diploma,
      userId: this.userId,
      isDisabled: this.isDisabled,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      deletedBy: this.deletedBy,
    };
  }
}

OrganizationLearner.STATUS = STATUS;

export { OrganizationLearner };
