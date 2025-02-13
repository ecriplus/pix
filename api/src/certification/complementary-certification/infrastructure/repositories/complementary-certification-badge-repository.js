import { knex } from '../../../../../db/knex-database-connection.js';
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { Badge } from '../../../../shared/domain/models/Badge.js';
import { ComplementaryCertificationBadge } from '../../domain/models/ComplementaryCertificationBadge.js';

const getAllIdsByTargetProfileId = async function ({ targetProfileId }) {
  const complementaryCertificationBadgesIds = await knex('badges')
    .select('complementary-certification-badges')
    .leftJoin('complementary-certification-badges', 'complementary-certification-badges.badgeId', 'badges.id')
    .leftJoin('target-profiles', 'target-profiles.id', 'badges.targetProfileId')
    .where({ targetProfileId })
    .andWhere('complementary-certification-badges.detachedAt', null)
    .pluck('complementary-certification-badges.id');
  return complementaryCertificationBadgesIds;
};

const detachByIds = async function ({ complementaryCertificationBadgeIds, domainTransaction }) {
  const knexConn = domainTransaction.knexTransaction;

  const now = new Date();

  return knexConn('complementary-certification-badges')
    .whereIn('id', complementaryCertificationBadgeIds)
    .update({ detachedAt: now });
};

const attach = async function ({ domainTransaction, complementaryCertificationBadges }) {
  const knexConn = domainTransaction.knexTransaction;
  const createdAt = new Date();

  for (const complementaryCertificationBadge of complementaryCertificationBadges) {
    await knexConn('complementary-certification-badges').insert({
      ...complementaryCertificationBadge,
      createdAt,
    });
  }
};

const findAttachableBadgesByIds = async function ({ ids }) {
  const badges = await knex
    .from('badges')
    .whereIn('badges.id', ids)
    .whereNotExists(
      knex
        .select(1)
        .from('complementary-certification-badges')
        .whereRaw('"complementary-certification-badges"."badgeId" = "badges"."id"'),
    );

  return badges.map((badge) => {
    return new Badge(badge);
  });
};

const getAllWithSameTargetProfile = async function (complementaryCertificationBadgeId) {
  const complementaryCertificationBadges = await knex('complementary-certification-badges')
    .select('complementary-certification-badges.*')
    .join('badges', 'badges.id', '=', 'complementary-certification-badges.badgeId')
    .where(
      'badges.targetProfileId',
      '=',
      knex('complementary-certification-badges')
        .select('target-profiles.id')
        .join('badges', 'badges.id', '=', 'complementary-certification-badges.badgeId')
        .join('target-profiles', 'target-profiles.id', '=', 'badges.targetProfileId')
        .where('complementary-certification-badges.id', '=', complementaryCertificationBadgeId),
    );

  if (complementaryCertificationBadges.length === 0) {
    throw new NotFoundError('No complementary certification badge found');
  }

  return complementaryCertificationBadges.map(_toDomain);
};

const isRelatedToCertification = async function (badgeId, { knexTransaction } = DomainTransaction.emptyTransaction()) {
  const complementaryCertificationBadge = await (knexTransaction ?? knex)('complementary-certification-badges')
    .where({ badgeId })
    .first();
  return !!complementaryCertificationBadge;
};

function _toDomain(complementaryCertificationBadgeDTO) {
  return new ComplementaryCertificationBadge(complementaryCertificationBadgeDTO);
}

export {
  attach,
  detachByIds,
  findAttachableBadgesByIds,
  getAllIdsByTargetProfileId,
  getAllWithSameTargetProfile,
  isRelatedToCertification,
};
