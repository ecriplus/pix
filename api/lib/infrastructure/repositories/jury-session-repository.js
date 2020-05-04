const _ = require('lodash');
const Bookshelf = require('../bookshelf');
const { NotFoundError } = require('../../domain/errors');
const JurySession = require('../../domain/models/JurySession');
const { statuses } = require('../../domain/models/JurySession');
const CertificationOfficer = require('../../domain/models/CertificationOfficer');

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

module.exports = {

  async get(id) {
    const results = await Bookshelf.knex
      .select('sessions.*', 'certification-centers.type', 'users.firstName', 'users.lastName')
      .from('sessions')
      .leftJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
      .leftJoin('users', 'users.id', 'sessions.assignedCertificationOfficerId')
      .where('sessions.id', '=', id)
      .limit(1);
    if (!results[0]) {
      throw new NotFoundError('La session n\'existe pas ou son accès est restreint');
    }
    return _toDomain(results[0]);
  },

  async findPaginatedFiltered({ filters, page }) {
    const pageSize = page.size ? page.size : DEFAULT_PAGE_SIZE;
    const pageNumber = page.number ? page.number : DEFAULT_PAGE_NUMBER;
    const offset = (pageNumber - 1) * pageSize;
    const query = Bookshelf.knex.from('sessions');

    _setupFilters(query, filters);
    query.orderByRaw('?? ASC NULLS FIRST', 'publishedAt')
      .orderByRaw('?? ASC', 'finalizedAt')
      .select('sessions.*', 'certification-centers.type', 'users.firstName', 'users.lastName')
      .select(Bookshelf.knex.raw('COUNT(*) OVER() AS ??', ['rowCount']))
      .leftJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
      .leftJoin('users', 'users.id', 'sessions.assignedCertificationOfficerId')
      .limit(pageSize).offset(offset);

    const results = await query;

    let rowCount = 0;
    const jurySessions = _.map(results, (result) => {
      rowCount = result.rowCount;
      return _toDomain(result);
    });

    return {
      jurySessions,
      pagination: {
        page: pageNumber,
        pageSize: pageSize,
        rowCount,
        pageCount: Math.ceil(rowCount / pageSize),
      },
    };
  },
};

function _toDomain(jurySessionFromDB) {
  const jurySession = new JurySession({
    ...jurySessionFromDB,
    certificationCenterName: jurySessionFromDB.certificationCenter,
    certificationCenterType: jurySessionFromDB.type,
  });

  if (jurySessionFromDB.assignedCertificationOfficerId) {
    jurySession.assignedCertificationOfficer = new CertificationOfficer({
      id: jurySessionFromDB.assignedCertificationOfficerId,
      firstName: jurySessionFromDB.firstName,
      lastName: jurySessionFromDB.lastName,
    });
  }

  return jurySession;
}

function _setupFilters(query, filters) {
  const { id, certificationCenterName, status, resultsSentToPrescriberAt } = filters;

  if (id) {
    query.where('sessions.id', id);
  }
  if (certificationCenterName) {
    query.whereRaw('LOWER("certificationCenter") LIKE ?', `%${certificationCenterName.toLowerCase()}%`);
  }
  if (resultsSentToPrescriberAt === 'true') {
    query.whereNotNull('resultsSentToPrescriberAt');
  }
  if (resultsSentToPrescriberAt === 'false') {
    query.whereNull('resultsSentToPrescriberAt');
  }
  if (status === statuses.CREATED) {
    query.whereNull('finalizedAt');
    query.whereNull('publishedAt');
  }
  if (status === statuses.FINALIZED) {
    query.whereNotNull('finalizedAt');
    query.whereNull('assignedCertificationOfficerId');
    query.whereNull('publishedAt');
  }
  if (status === statuses.IN_PROCESS) {
    query.whereNotNull('finalizedAt');
    query.whereNotNull('assignedCertificationOfficerId');
    query.whereNull('publishedAt');
  }
  if (status === statuses.PROCESSED) {
    query.whereNotNull('publishedAt');
  }
}
