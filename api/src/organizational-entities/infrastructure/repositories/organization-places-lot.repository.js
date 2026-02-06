import { PlacesLot } from '../../../organizational-entities/domain/read-models/PlacesLot.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

const findAllByOrganizationIds = async ({ organizationIds, callOrderByAndRemoveDeleted = false }) => {
  const placesLots = await baseQuery({ organizationIds, callOrderByAndRemoveDeleted });
  return placesLots.map((placesLot) => new PlacesLot(placesLot));
};

const baseQuery = ({ organizationIds, callOrderByAndRemoveDeleted = false }) => {
  const knexConn = DomainTransaction.getConnection();

  let query = knexConn('organization-places')
    .select(
      'organization-places.id',
      'organization-places.count',
      'organization-places.organizationId',
      'organization-places.activationDate',
      'organization-places.expirationDate',
      'organization-places.deletedAt',
    )
    .whereIn('organization-places.organizationId', organizationIds);

  if (callOrderByAndRemoveDeleted) {
    query = orderByAndRemoveDeleted(query, knexConn);
  }

  return query;
};

const orderByAndRemoveDeleted = (query, knexConn) => {
  return query
    .whereNull('organization-places.deletedAt')
    .orderBy(
      knexConn.raw(
        'CASE WHEN "organization-places"."activationDate" <= now() AND "organization-places"."expirationDate" >= now() THEN 1 WHEN "organization-places"."activationDate" > now() THEN 2 ELSE 3 END',
      ),
      'asc',
    )
    .orderBy('organization-places.expirationDate', 'desc')
    .orderBy('organization-places.activationDate', 'desc')
    .orderBy('organization-places.createdAt', 'desc');
};

export { findAllByOrganizationIds };
