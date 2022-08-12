// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../../config');

const CAMPAIGN_TYPE = 'EVALUATION';
const STRUCTURE_NAME = 'Pix';
const STRUCTURE_TYPE = 'externe';
const CAMPAIGN_URL = `${config.domain.pixApp}${config.domain.tldFr}/campagnes`;
const TEST_STATE = { STARTED: 2, FINISHED: 3, SHARED: 4 };
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UNITS'.
const UNITS = { PERCENTAGE: 'A', SCORE: 'B' };
const EVALUATION_CATEGORY = 'competence';
const EVALUATION_TYPE = 'competence Pix';
const PROGRESSION = { STARTED: 0, FINISHED: 100 };
const PROFILE_TYPES = { DI: 'DI', PC: 'PC', CP: 'CP' };

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
class PoleEmploiPayload {
  campagne: $TSFixMe;
  individu: $TSFixMe;
  test: $TSFixMe;
  constructor({
    individu,
    campagne,
    test
  }: $TSFixMe) {
    this.individu = individu;
    this.campagne = campagne;
    this.test = test;
  }

  static buildForParticipationStarted({
    user,
    campaign,
    targetProfile,
    participation
  }: $TSFixMe) {
    return new PoleEmploiPayload({
      individu: _buildIndividu({ user }),
      campagne: _buildCampaign({ campaign }),
      test: _buildTest({ etat: TEST_STATE.STARTED, targetProfile, participation }),
    });
  }

  static buildForParticipationFinished({
    user,
    campaign,
    targetProfile,
    participation,
    assessment
  }: $TSFixMe) {
    return new PoleEmploiPayload({
      individu: _buildIndividu({ user }),
      campagne: _buildCampaign({ campaign }),
      test: _buildTest({ etat: TEST_STATE.FINISHED, targetProfile, participation, assessment }),
    });
  }

  static buildForParticipationShared({
    user,
    campaign,
    targetProfile,
    participation,
    participationResult
  }: $TSFixMe) {
    return new PoleEmploiPayload({
      individu: _buildIndividu({ user }),
      campagne: _buildCampaign({ campaign }),
      test: _buildTest({ etat: TEST_STATE.SHARED, targetProfile, participation, participationResult }),
    });
  }

  toString() {
    return JSON.stringify({
      campagne: this.campagne,
      individu: this.individu,
      test: this.test,
    });
  }
}

function _buildIndividu({
  user
}: $TSFixMe) {
  return {
    nom: user.lastName,
    prenom: user.firstName,
  };
}

function _buildCampaign({
  campaign
}: $TSFixMe) {
  return {
    nom: campaign.name,
    dateDebut: campaign.createdAt,
    dateFin: campaign.archivedAt,
    type: CAMPAIGN_TYPE,
    codeCampagne: campaign.code,
    urlCampagne: `${CAMPAIGN_URL}/${campaign.code}`,
    nomOrganisme: STRUCTURE_NAME,
    typeOrganisme: STRUCTURE_TYPE,
  };
}

function _buildTest({
  etat,
  targetProfile,
  participation,
  participationResult,
  assessment
}: $TSFixMe) {
  let progression = null;
  let dateProgression = null;
  let dateValidation = null;
  let evaluation = null;
  let elementsEvalues = [];

  switch (etat) {
    case TEST_STATE.STARTED:
      progression = PROGRESSION.STARTED;
      break;
    case TEST_STATE.FINISHED:
      progression = PROGRESSION.FINISHED;
      dateProgression = assessment.updatedAt;
      break;
    case TEST_STATE.SHARED:
      progression = PROGRESSION.FINISHED;
      dateProgression = participation.sharedAt;
      dateValidation = participation.sharedAt;
      evaluation = participationResult.masteryPercentage;
      elementsEvalues = _.map(participationResult.competenceResults, _buildElementEvalue);
      break;
  }

  return {
    etat,
    progression,
    typeTest: _getTypeTest(targetProfile.name),
    referenceExterne: participation.id,
    dateDebut: participation.createdAt,
    dateProgression,
    dateValidation,
    evaluation,
    uniteEvaluation: UNITS.PERCENTAGE,
    elementsEvalues,
  };
}

function _buildElementEvalue(competence: $TSFixMe) {
  return {
    libelle: competence.name,
    categorie: EVALUATION_CATEGORY,
    type: EVALUATION_TYPE,
    domaineRattachement: competence.areaName,
    nbSousElements: competence.totalSkillsCount,
    evaluation: {
      scoreObtenu: competence.masteryPercentage,
      uniteScore: UNITS.PERCENTAGE,
      nbSousElementValide: competence.validatedSkillsCount,
    },
  };
}

function _getTypeTest(targetProfileName: $TSFixMe) {
  if (targetProfileName.includes('Diagnostic initial')) {
    return PROFILE_TYPES.DI;
  } else if (targetProfileName.includes('Parcours complet')) {
    return PROFILE_TYPES.PC;
  }
  return PROFILE_TYPES.CP;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PoleEmploiPayload;
