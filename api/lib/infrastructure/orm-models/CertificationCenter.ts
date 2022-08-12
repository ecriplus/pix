// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./ComplementaryCertification');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'CertificationCenter';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'certification-centers',
    hasTimestamps: ['createdAt', 'updatedAt'],

    certificationCenterMemberships() {
      return this.hasMany('CertificationCenterMembership', 'certificationCenterId');
    },

    habilitations() {
      return this.belongsToMany(
        'ComplementaryCertification',
        'complementary-certification-habilitations',
        'certificationCenterId',
        'complementaryCertificationId'
      );
    },
  },
  {
    modelName,
  }
);
