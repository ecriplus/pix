// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCertificationCenterMembership = require('../orm-models/CertificationCenterMembership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../../infrastructure/utils/bookshelf-to-domain-converter');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCenterMembershipCreationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingMembershipError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCenterMembershipDisableError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../domain/models/CertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenterMembership = require('../../domain/models/CertificationCenterMembership');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(certificationCenterMembershipDTO: $TSFixMe) {
  let user, certificationCenter;
  if (certificationCenterMembershipDTO.lastName || certificationCenterMembershipDTO.firstName) {
    user = new User({
      id: certificationCenterMembershipDTO.userId,
      firstName: certificationCenterMembershipDTO.firstName,
      lastName: certificationCenterMembershipDTO.lastName,
      email: certificationCenterMembershipDTO.email,
    });
  }
  if (certificationCenterMembershipDTO.name) {
    certificationCenter = new CertificationCenter({
      id: certificationCenterMembershipDTO.certificationCenterId,
      name: certificationCenterMembershipDTO.name,
      type: certificationCenterMembershipDTO.type,
      externalId: certificationCenterMembershipDTO.externalId,
      createdAt: certificationCenterMembershipDTO.certificationCenterCreatedAt,
      updatedAt: certificationCenterMembershipDTO.certificationCenterUpdatedAt,
    });
  }
  return new CertificationCenterMembership({
    id: certificationCenterMembershipDTO.id,
    certificationCenter,
    user,
    createdAt: certificationCenterMembershipDTO.createdAt,
    updatedAt: certificationCenterMembershipDTO.updatedAt,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByUserId(userId: $TSFixMe) {
    const certificationCenterMemberships = await BookshelfCertificationCenterMembership.where({
      userId,
      disabledAt: null,
    }).fetchAll({
      withRelated: ['certificationCenter'],
    });

    return bookshelfToDomainConverter.buildDomainObjects(
      BookshelfCertificationCenterMembership,
      certificationCenterMemberships
    );
  },

  async findActiveByCertificationCenterIdSortedByNames({
    certificationCenterId
  }: $TSFixMe) {
    const certificationCenterMemberships = await knex
      .select(
        'certification-center-memberships.*',
        'users.firstName',
        'users.lastName',
        'users.email',
        'certification-centers.name',
        'certification-centers.type',
        'certification-centers.externalId',
        'certification-centers.createdAt AS certificationCenterCreatedAt',
        'certification-centers.updatedAt AS certificationCenterUpdatedAt'
      )
      .from('certification-center-memberships')
      .leftJoin('users', 'users.id', 'certification-center-memberships.userId')
      .leftJoin(
        'certification-centers',
        'certification-centers.id',
        'certification-center-memberships.certificationCenterId'
      )
      .where({
        certificationCenterId,
        disabledAt: null,
      })
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC');
    return certificationCenterMemberships.map(_toDomain);
  },

  async findActiveByCertificationCenterIdSortedById({
    certificationCenterId
  }: $TSFixMe) {
    const certificationCenterMemberships = await BookshelfCertificationCenterMembership.where({
      certificationCenterId,
      disabledAt: null,
    })
      .orderBy('id', 'ASC')
      .fetchAll({
        withRelated: ['certificationCenter', 'user'],
      });

    return bookshelfToDomainConverter.buildDomainObjects(
      BookshelfCertificationCenterMembership,
      certificationCenterMemberships
    );
  },

  async save({
    userId,
    certificationCenterId
  }: $TSFixMe) {
    try {
      const newCertificationCenterMembership = await new BookshelfCertificationCenterMembership({
        userId,
        certificationCenterId,
      })
        .save()
        .then((model: $TSFixMe) => model.fetch({ withRelated: ['user', 'certificationCenter'] }));

      return bookshelfToDomainConverter.buildDomainObject(
        BookshelfCertificationCenterMembership,
        newCertificationCenterMembership
      );
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingMembershipError(
          `User is already member of certification center ${certificationCenterId}`
        );
      }
      if (bookshelfUtils.foreignKeyConstraintViolated(err)) {
        throw new CertificationCenterMembershipCreationError();
      }
      throw err;
    }
  },

  async isMemberOfCertificationCenter({
    userId,
    certificationCenterId
  }: $TSFixMe) {
    const certificationCenterMembershipId = await knex('certification-center-memberships')
      .select('id')
      .where({
        userId,
        certificationCenterId,
        disabledAt: null,
      })
      .first();

    return Boolean(certificationCenterMembershipId);
  },

  async disableById({
    certificationCenterMembershipId
  }: $TSFixMe) {
    try {
      const now = new Date();
      const result = await knex('certification-center-memberships')
        .where({ id: certificationCenterMembershipId })
        .update({ disabledAt: now })
        .returning('*');

      if (result.length === 0) {
        throw new CertificationCenterMembershipDisableError();
      }
    } catch (e) {
      throw new CertificationCenterMembershipDisableError();
    }
  },
};
