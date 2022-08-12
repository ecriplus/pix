// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(studentInformationForAccountRecovery: $TSFixMe) {
    return new Serializer('student-information-for-account-recoveries', {
      attributes: ['firstName', 'lastName', 'username', 'email', 'latestOrganizationName'],
    }).serialize(studentInformationForAccountRecovery);
  },

  serializeAccountRecovery(accountRecoveryDemand: $TSFixMe) {
    return new Serializer('account-recovery-demand', {
      attributes: ['firstName', 'email'],
    }).serialize(accountRecoveryDemand);
  },

  async deserialize(studentInformationForAccountRecovery: $TSFixMe) {
    function transform(record: $TSFixMe) {
      return {
        ineIna: record['ine-ina'],
        firstName: record['first-name'],
        lastName: record['last-name'],
        birthdate: record.birthdate,
        ...(record.email && { email: record.email }),
      };
    }
    return new Deserializer({ transform })
      .deserialize(studentInformationForAccountRecovery)
      .then((studentInformation: $TSFixMe) => studentInformation);
  },
};
