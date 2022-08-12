// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfPoleEmploiSending = require('../orm-models/PoleEmploiSending');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create({
    poleEmploiSending
  }: $TSFixMe) {
    return new BookshelfPoleEmploiSending(poleEmploiSending).save();
  },

  async find(sending: $TSFixMe, filters: $TSFixMe) {
    const POLE_EMPLOI_SENDINGS_LIMIT = settings.poleEmploi.poleEmploiSendingsLimit;
    const IDENTITY_PROVIDER_POLE_EMPLOI = settings.poleEmploi.poleEmploiIdentityProvider;

    const rawSendings = await Bookshelf.knex('pole-emploi-sendings')
      .select(
        'pole-emploi-sendings.id AS idEnvoi',
        'pole-emploi-sendings.createdAt AS dateEnvoi',
        'pole-emploi-sendings.payload AS resultat',
        'authentication-methods.externalIdentifier AS idPoleEmploi'
      )
      .join('campaign-participations', 'campaign-participations.id', 'pole-emploi-sendings.campaignParticipationId')
      .join('authentication-methods', 'authentication-methods.userId', 'campaign-participations.userId')
      .where('authentication-methods.identityProvider', IDENTITY_PROVIDER_POLE_EMPLOI)
      .modify(_olderThan, sending)
      .modify(_filterByStatus, filters)
      .orderBy([
        { column: 'pole-emploi-sendings.createdAt', order: 'desc' },
        { column: 'pole-emploi-sendings.id', order: 'desc' },
      ])
      .limit(POLE_EMPLOI_SENDINGS_LIMIT);

    const sendings = rawSendings.map((rawSending: $TSFixMe) => {
      const { idPoleEmploi, ...sending } = rawSending;
      sending.resultat.individu['idPoleEmploi'] = idPoleEmploi;
      return sending;
    });

    return sendings;
  },
};

function _olderThan(qb: $TSFixMe, sending: $TSFixMe) {
  if (sending) {
    qb.where('pole-emploi-sendings.createdAt', '<', sending.dateEnvoi).where(
      'pole-emploi-sendings.id',
      '<',
      sending.idEnvoi
    );
  }
}

function _filterByStatus(qb: $TSFixMe, filters = {}) {
  if (Object.keys(filters).includes('isSuccessful')) {
    qb.where({ isSuccessful: (filters as $TSFixMe).isSuccessful });
  }
}
