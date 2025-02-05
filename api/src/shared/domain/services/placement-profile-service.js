import { AlgorithmEngineVersion } from '../../../certification/shared/domain/models/AlgorithmEngineVersion.js';
import * as scoringService from '../../../evaluation/domain/services/scoring/scoring-service.js';
import * as knowledgeElementSnapshotRepository from '../../../prescription/campaign/infrastructure/repositories/knowledge-element-snapshot-repository.js';
import { PlacementProfile } from '../../domain/models/PlacementProfile.js';
import { UserCompetence } from '../../domain/models/UserCompetence.js';
import * as assessmentRepository from '../../infrastructure/repositories/assessment-repository.js';
import * as assessmentResultRepository from '../../infrastructure/repositories/assessment-result-repository.js';
import * as competenceRepository from '../../infrastructure/repositories/competence-repository.js';
import * as knowledgeElementRepository from '../../infrastructure/repositories/knowledge-element-repository.js';
import * as skillRepository from '../../infrastructure/repositories/skill-repository.js';
import { PromiseUtils } from '../../infrastructure/utils/promise-utils.js';

async function getPlacementProfile({
  userId,
  limitDate,
  version = AlgorithmEngineVersion.V2,
  allowExcessPixAndLevels = true,
  locale,
}) {
  const pixCompetences = await competenceRepository.listPixCompetencesOnly({ locale });

  if (!AlgorithmEngineVersion.isV1(version)) {
    return _generatePlacementProfile({
      userId,
      profileDate: limitDate,
      competences: pixCompetences,
      allowExcessPixAndLevels,
    });
  }
  return _generatePlacementProfileV1({ userId, profileDate: limitDate, competences: pixCompetences });
}

async function _createUserCompetencesV1({ competences, userLastAssessments, limitDate }) {
  return PromiseUtils.mapSeries(competences, async (competence) => {
    const assessment = userLastAssessments.find((userAssessment) => userAssessment.competenceId === competence.id);
    let estimatedLevel = 0;
    let pixScore = 0;
    if (assessment) {
      const assessmentResultLevelAndPixScore =
        await assessmentResultRepository.findLatestLevelAndPixScoreByAssessmentId({
          assessmentId: assessment.id,
          limitDate,
        });
      estimatedLevel = assessmentResultLevelAndPixScore.level;
      pixScore = assessmentResultLevelAndPixScore.pixScore;
    }
    return new UserCompetence({
      id: competence.id,
      areaId: competence.areaId,
      index: competence.index,
      name: competence.name,
      estimatedLevel,
      pixScore,
    });
  });
}

async function _generatePlacementProfileV1({ userId, profileDate, competences }) {
  const placementProfile = new PlacementProfile({
    userId,
    profileDate,
  });
  const userLastAssessments = await assessmentRepository.findLastCompletedAssessmentsForEachCompetenceByUser(
    placementProfile.userId,
    placementProfile.profileDate,
  );
  placementProfile.userCompetences = await _createUserCompetencesV1({
    competences,
    userLastAssessments,
    limitDate: placementProfile.profileDate,
  });

  return placementProfile;
}

function _createUserCompetencesV2({
  knowledgeElementsByCompetence,
  competences,
  allowExcessPixAndLevels = true,
  skills = [],
}) {
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));

  return competences.map((competence) => {
    const knowledgeElementsForCompetence = knowledgeElementsByCompetence[competence.id] || [];

    const { pixScoreForCompetence, currentLevel } = scoringService.calculateScoringInformationForCompetence({
      knowledgeElements: knowledgeElementsForCompetence,
      allowExcessPix: allowExcessPixAndLevels,
      allowExcessLevel: allowExcessPixAndLevels,
    });

    const directlyValidatedCompetenceSkills = _matchingDirectlyValidatedSkillsForCompetence(
      knowledgeElementsForCompetence,
      skillMap,
    );
    return new UserCompetence({
      id: competence.id,
      areaId: competence.areaId,
      index: competence.index,
      name: competence.name,
      estimatedLevel: currentLevel,
      pixScore: pixScoreForCompetence,
      skills: directlyValidatedCompetenceSkills,
    });
  });
}

async function _generatePlacementProfile({ userId, profileDate, competences, allowExcessPixAndLevels }) {
  const knowledgeElementsByCompetence = await knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
    userId,
    limitDate: profileDate,
  });

  const skills = await skillRepository.list();

  const userCompetences = _createUserCompetencesV2({
    knowledgeElementsByCompetence,
    competences,
    allowExcessPixAndLevels,
    skills,
  });

  return new PlacementProfile({
    userId,
    profileDate,
    userCompetences,
  });
}

async function getPlacementProfilesWithSnapshotting({ participations, competences, allowExcessPixAndLevels = true }) {
  const campaignParticipationIds = participations.map(({ campaignParticipationId }) => campaignParticipationId);
  const knowledgeElementsParticipations =
    await knowledgeElementSnapshotRepository.findCampaignParticipationKnowledgeElementSnapshots(
      campaignParticipationIds,
    );

  return participations.map((participation) => {
    const keForParticipation = knowledgeElementsParticipations.find((knowledgeElementsParticipation) => {
      return knowledgeElementsParticipation.campaignParticipationId === participation.campaignParticipationId;
    });

    const knowledgeElementsByCompetence = keForParticipation.knowledgeElements
      ? keForParticipation.knowledgeElements.reduce((acc, ke) => {
          if (!acc[ke.competenceId]) {
            acc[ke.competenceId] = [];
          }
          acc[ke.competenceId].push(ke);
          return acc;
        }, {})
      : {};

    const userCompetences = _createUserCompetencesV2({
      knowledgeElementsByCompetence,
      competences,
      allowExcessPixAndLevels,
    });

    return new PlacementProfile({
      userId: participation.userId,
      profileDate: participation.sharedAt,
      userCompetences,
    });
  });
}

async function getPlacementProfileWithSnapshotting({
  userId,
  limitDate,
  competences,
  allowExcessPixAndLevels = true,
  campaignParticipationId,
}) {
  const snapshots = await knowledgeElementSnapshotRepository.findByCampaignParticipationIds([campaignParticipationId]);
  const knowledgeElements = snapshots[campaignParticipationId];
  const knowledgeElementsByCompetence = knowledgeElements
    ? knowledgeElements.reduce((acc, ke) => {
        if (!acc[ke.competenceId]) {
          acc[ke.competenceId] = [];
        }
        acc[ke.competenceId].push(ke);
        return acc;
      }, {})
    : {};

  const userCompetences = _createUserCompetencesV2({
    knowledgeElementsByCompetence,
    competences,
    allowExcessPixAndLevels,
  });

  return new PlacementProfile({
    userId,
    profileDate: limitDate,
    userCompetences,
  });
}

function _matchingDirectlyValidatedSkillsForCompetence(knowledgeElementsForCompetence, skillMap) {
  const competenceSkills = knowledgeElementsForCompetence
    .filter((ke) => ke.isDirectlyValidated())
    .map((ke) => {
      return skillMap.get(ke.skillId);
    });

  return competenceSkills.filter(Boolean);
}

export { getPlacementProfile, getPlacementProfilesWithSnapshotting, getPlacementProfileWithSnapshotting };
