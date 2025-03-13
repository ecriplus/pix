import { KnowledgeElement } from '../../../shared/domain/models/index.js';

export class Success {
  constructor({ knowledgeElements, campaignSkills }) {
    this.knowledgeElements = knowledgeElements;
    this.campaignSkills = campaignSkills;
  }

  /**
   *
   * @param {Array<string>} skillIds
   * @returns {number}
   */
  getMasteryPercentageForSkills(skillIds) {
    // genre de doublon avec api/src/shared/domain/models/CampaignParticipationResult.js:64
    const totalSkillsCount = skillIds?.length;
    if (!totalSkillsCount) {
      return 0;
    }
    const validatedSkillsCount = this.knowledgeElements.filter(
      (ke) => ke.status === KnowledgeElement.StatusType.VALIDATED && skillIds.includes(ke.skillId),
    ).length;
    return Math.round((validatedSkillsCount * 100) / totalSkillsCount);
  }

  /**
   *
   * @param {Array<{tubeId: string, level: number}>} cappedTubes
   * @returns {number}
   */
  // Pour cette implémentation, ne tient pas compte des versions d'acquis obtenus dans les campagnes
  // potentiellement effectuées dans le cadre de la quête, mais seulement du profil de l'utilisateur
  // pour que ça marche efficacement, ajouter une condition d'éligibilité qui impose d'être allé au bout
  // de la participation, on s'assure ainsi qu'il a bien un KE pour chaque acquis des campagnes et qu'il
  // n'obtienne pas l'attestation sans avoir effectivement participé

  // L'autre solution serait de baser les cappedTubes sur l'ensemble des lots d'acquis des campagnes
  // concernées peut-être ?
  /*getMasteryPercentageForCappedTubes(cappedTubes) {
    if (!cappedTubes?.length) {
      return 0;
    }

    let sumTotal = 0;
    let sumValidated = 0;
    for (const { tubeId, level } of cappedTubes) {
      sumTotal += level; // ceci est très cavalier, je présuppose que le référentiel n'a aucun trou \o/
      const dataForTubeId = this.#dataByTubeId[tubeId] ?? [];
      sumValidated += dataForTubeId.filter(({ isValidated, difficulty }) => isValidated && difficulty <= level).length;
    }
    return Math.round((sumValidated * 100) / sumTotal);
  }*/
}
