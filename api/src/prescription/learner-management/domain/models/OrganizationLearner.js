const STATUS = {
  STUDENT: 'ST',
  APPRENTICE: 'AP',
};
class OrganizationLearner {
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

  updateCertificability(placementProfile) {
    this.certifiableAt = placementProfile.profileDate;
    this.isCertifiable = placementProfile.isCertifiable();
  }

  delete(userId) {
    this.deletedAt = new Date();
    this.updatedAt = this.deletedAt;
    this.deletedBy = userId;
  }
}

OrganizationLearner.STATUS = STATUS;

export { OrganizationLearner };
