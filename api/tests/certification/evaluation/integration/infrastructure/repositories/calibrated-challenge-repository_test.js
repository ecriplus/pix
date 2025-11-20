import { knex } from '../../../../../../db/knex-database-connection.js';
import * as calibratedChallengeRepository from '../../../../../../src/certification/evaluation/infrastructure/repositories/calibrated-challenge-repository.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Evaluation | Integration | Repository | calibrated-challenge-repository', function () {
  const challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson = {
    id: 'challengeId00',
    instruction: 'instruction challengeId00',
    alternativeInstruction: 'alternativeInstruction challengeId00',
    proposals: 'proposals challengeId00',
    type: 'QCU',
    solution: 'solution challengeId00',
    solutionToDisplay: 'solutionToDisplay challengeId00',
    t1Status: true,
    t2Status: false,
    t3Status: true,
    status: 'validé',
    genealogy: 'genealogy challengeId00',
    accessibility1: 'accessibility1 challengeId00',
    accessibility2: 'accessibility2 challengeId00',
    requireGafamWebsiteAccess: true,
    isIncompatibleIpadCertif: false,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId00',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 10,
    shuffled: true,
    illustrationAlt: 'illustrationAlt challengeId00',
    illustrationUrl: 'illustrationUrl challengeId00',
    attachments: ['attachment1', 'attachment2'],
    responsive: 'responsive challengeId00',
    alpha: 1.1,
    delta: 3.3,
    autoReply: true,
    focusable: true,
    format: 'format challengeId00',
    timer: 180,
    embedHeight: 800,
    embedUrl: 'embedUrl challengeId00',
    embedTitle: 'embedTitle challengeId00',
    locales: ['fr', 'nl'],
    competenceId: 'competenceId00',
    skillId: 'skillId00',
    hasEmbedInternalValidation: true,
    noValidationNeeded: true,
  };
  const challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson = {
    id: 'challengeId01',
    instruction: 'instruction challengeId01',
    alternativeInstruction: 'alternativeInstruction challengeId01',
    proposals: 'proposals challengeId01',
    type: 'QCU',
    solution: 'solution challengeId01',
    solutionToDisplay: 'solutionToDisplay challengeId01',
    t1Status: false,
    t2Status: true,
    t3Status: true,
    status: 'validé',
    genealogy: 'genealogy challengeId01',
    accessibility1: 'accessibility1 challengeId01',
    accessibility2: 'accessibility2 challengeId01',
    requireGafamWebsiteAccess: false,
    isIncompatibleIpadCertif: true,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId01',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 20,
    shuffled: false,
    illustrationAlt: 'illustrationAlt challengeId01',
    illustrationUrl: 'illustrationUrl challengeId01',
    attachments: ['attachment1', 'attachment2'],
    responsive: 'responsive challengeId01',
    alpha: 1.2,
    delta: 3.4,
    autoReply: true,
    focusable: false,
    format: 'format challengeId01',
    timer: 180,
    embedHeight: 801,
    embedUrl: 'https://example.com/embed.json',
    embedTitle: 'embedTitle challengeId01',
    locales: ['fr', 'en'],
    competenceId: 'competenceId00',
    skillId: 'skillId00',
    hasEmbedInternalValidation: true,
    noValidationNeeded: true,
  };
  const challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson = {
    id: 'challengeId02',
    instruction: 'instruction challengeId02',
    alternativeInstruction: 'alternativeInstruction challengeId02',
    proposals: 'proposals challengeId02',
    type: 'QCM',
    solution: 'solution challengeId02',
    solutionToDisplay: 'solutionToDisplay challengeId02',
    t1Status: false,
    t2Status: true,
    t3Status: false,
    status: 'archivé',
    genealogy: 'genealogy challengeId02',
    accessibility1: 'accessibility1 challengeId02',
    accessibility2: 'accessibility2 challengeId02',
    requireGafamWebsiteAccess: false,
    isIncompatibleIpadCertif: false,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId02',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 30,
    shuffled: false,
    illustrationAlt: 'illustrationAlt challengeId02',
    illustrationUrl: 'illustrationUrl challengeId02',
    attachments: ['attachment1', 'attachment2'],
    responsive: 'responsive challengeId02',
    alpha: 1.3,
    delta: 3.5,
    autoReply: false,
    focusable: false,
    format: 'format challengeId02',
    timer: null,
    embedHeight: 802,
    embedUrl: 'embed url challengeId02',
    embedTitle: 'embedTitle challengeId02',
    locales: ['en'],
    competenceId: 'competenceId00',
    skillId: 'skillId00',
  };
  const challengeData03_skill00_qcm_valide_flashCompatible_nl_noEmbedJson = {
    id: 'challengeId03',
    instruction: 'instruction challengeId03',
    alternativeInstruction: 'alternativeInstruction challengeId03',
    proposals: 'proposals challengeId03',
    type: 'QCM',
    solution: 'solution challengeId03',
    solutionToDisplay: 'solutionToDisplay challengeId03',
    t1Status: true,
    t2Status: true,
    t3Status: false,
    status: 'validé',
    genealogy: 'genealogy challengeId03',
    accessibility1: 'accessibility1 challengeId03',
    accessibility2: 'accessibility2 challengeId03',
    requireGafamWebsiteAccess: true,
    isIncompatibleIpadCertif: false,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId03',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 40,
    shuffled: true,
    illustrationAlt: 'illustrationAlt challengeId03',
    illustrationUrl: 'illustrationUrl challengeId03',
    attachments: ['attachment1', 'attachment2'],
    responsive: 'responsive challengeId03',
    alpha: 1.4,
    delta: 3.6,
    autoReply: true,
    focusable: false,
    format: 'format challengeId03',
    timer: null,
    embedHeight: 803,
    embedUrl: 'embed url challengeId03',
    embedTitle: 'embedTitle challengeId03',
    locales: ['nl'],
    competenceId: 'competenceId00',
    skillId: 'skillId00',
  };
  const skillData00_tube00competence00_actif = {
    id: 'skillId00',
    name: 'name skillId00',
    status: 'actif',
    pixValue: 2.9,
    version: 5,
    level: 2,
    hintStatus: 'hintStatus Acquis 0',
    competenceId: 'competenceId00',
    tubeId: 'tubeId00',
    tutorialIds: [],
    learningMoreTutorialIds: [],
    hint_i18n: { fr: 'hint FR skillId00', en: 'hint EN skillId00' },
  };
  const challengeData04_skill01_qcu_valide_flashCompatible_ennl_noEmbedJson = {
    id: 'challengeId04',
    instruction: 'instruction challengeId04',
    alternativeInstruction: 'alternativeInstruction challengeId04',
    proposals: 'proposals challengeId04',
    type: 'QCU',
    solution: 'solution challengeId04',
    solutionToDisplay: 'solutionToDisplay challengeId04',
    t1Status: true,
    t2Status: false,
    t3Status: false,
    status: 'validé',
    genealogy: 'genealogy challengeId04',
    accessibility1: 'accessibility1 challengeId04',
    accessibility2: 'accessibility2 challengeId04',
    requireGafamWebsiteAccess: false,
    isIncompatibleIpadCertif: false,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId04',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 10,
    shuffled: false,
    illustrationAlt: 'illustrationAlt challengeId04',
    illustrationUrl: 'illustrationUrl challengeId04',
    attachments: ['attachment1'],
    responsive: 'responsive challengeId04',
    alpha: 1.5,
    delta: 3.7,
    autoReply: true,
    focusable: false,
    format: 'format challengeId04',
    timer: 555,
    embedHeight: 804,
    embedUrl: 'embedUrl challengeId04',
    embedTitle: 'embedTitle challengeId04',
    locales: ['en', 'nl'],
    competenceId: 'competenceId00',
    skillId: 'skillId01',
  };
  const skillData01_tube01competence00_actif = {
    id: 'skillId01',
    name: 'name skillId01',
    status: 'actif',
    pixValue: 3.9,
    version: 5,
    level: 1,
    hintStatus: 'hintStatus Acquis 1',
    competenceId: 'competenceId00',
    tubeId: 'tubeId01',
    tutorialIds: [],
    learningMoreTutorialIds: [],
    hint_i18n: { fr: 'hint FR skillId01', en: 'hint EN skillId01' },
  };
  const challengeData05_skill02_qcm_perime_flashCompatible_fren_noEmbedJson = {
    id: 'challengeId05',
    instruction: 'instruction challengeId05',
    alternativeInstruction: 'alternativeInstruction challengeId05',
    proposals: 'proposals challengeId05',
    type: 'QCM',
    solution: 'solution challengeId05',
    solutionToDisplay: 'solutionToDisplay challengeId05',
    t1Status: true,
    t2Status: false,
    t3Status: true,
    status: 'périmé',
    genealogy: 'genealogy challengeId05',
    accessibility1: 'accessibility1 challengeId05',
    accessibility2: 'accessibility2 challengeId05',
    requireGafamWebsiteAccess: false,
    isIncompatibleIpadCertif: true,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId05',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 10,
    shuffled: true,
    illustrationAlt: 'illustrationAlt challengeId05',
    illustrationUrl: 'illustrationUrl challengeId05',
    attachments: ['attachment1'],
    responsive: 'responsive challengeId05',
    alpha: 1.6,
    delta: 3.8,
    autoReply: true,
    focusable: true,
    format: 'format challengeId05',
    timer: null,
    embedHeight: 805,
    embedUrl: 'embedUrl challengeId05',
    embedTitle: 'embedTitle challengeId05',
    locales: ['en', 'fr'],
    competenceId: 'competenceId01',
    skillId: 'skillId02',
  };
  const challengeData06_skill02_qcm_perime_notFlashCompatible_fren_noEmbedJson = {
    id: 'challengeId06',
    instruction: 'instruction challengeId06',
    alternativeInstruction: 'alternativeInstruction challengeId06',
    proposals: 'proposals challengeId06',
    type: 'QCM',
    solution: 'solution challengeId06',
    solutionToDisplay: 'solutionToDisplay challengeId06',
    t1Status: true,
    t2Status: false,
    t3Status: true,
    status: 'périmé',
    genealogy: 'genealogy challengeId06',
    accessibility1: 'accessibility1 challengeId06',
    accessibility2: 'accessibility2 challengeId06',
    requireGafamWebsiteAccess: false,
    isIncompatibleIpadCertif: true,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId06',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 10,
    shuffled: true,
    illustrationAlt: 'illustrationAlt challengeId06',
    illustrationUrl: 'illustrationUrl challengeId06',
    attachments: ['attachment1'],
    responsive: 'responsive challengeId06',
    alpha: null,
    delta: 3.8,
    autoReply: true,
    focusable: true,
    format: 'format challengeId06',
    timer: null,
    embedHeight: 806,
    embedUrl: 'embedUrl challengeId06',
    embedTitle: 'embedTitle challengeId06',
    locales: ['en', 'fr'],
    competenceId: 'competenceId01',
    skillId: 'skillId02',
  };
  const skillData02_tube02competence01_perime = {
    id: 'skillId02',
    name: 'name skillId02',
    status: 'périmé',
    pixValue: 2,
    version: 1,
    level: 3,
    hintStatus: 'hintStatus Acquis 2',
    competenceId: 'competenceId01',
    tubeId: 'tubeId02',
    tutorialIds: [],
    learningMoreTutorialIds: [],
    hint_i18n: { fr: 'hint FR skillId02', en: 'hint EN skillId02' },
  };
  const challengeData07_skill03_qcm_valide_notFlashCompatible_frnl_noEmbedJson = {
    id: 'challengeId07',
    instruction: 'instruction challengeId07',
    alternativeInstruction: 'alternativeInstruction challengeId07',
    proposals: 'proposals challengeId07',
    type: 'QCM',
    solution: 'solution challengeId07',
    solutionToDisplay: 'solutionToDisplay challengeId07',
    t1Status: true,
    t2Status: true,
    t3Status: true,
    status: 'validé',
    genealogy: 'genealogy challengeId07',
    accessibility1: 'accessibility1 challengeId07',
    accessibility2: 'accessibility2 challengeId07',
    requireGafamWebsiteAccess: false,
    isIncompatibleIpadCertif: true,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId07',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 10,
    shuffled: true,
    illustrationAlt: 'illustrationAlt challengeId07',
    illustrationUrl: 'illustrationUrl challengeId07',
    attachments: ['attachment1'],
    responsive: 'responsive challengeId07',
    alpha: 0.8,
    delta: null,
    autoReply: false,
    focusable: true,
    format: 'format challengeId07',
    timer: null,
    embedHeight: null,
    embedUrl: 'embedUrl challengeId07',
    embedTitle: 'embedTitle challengeId07',
    locales: ['nl', 'fr'],
    competenceId: 'competenceId01',
    skillId: 'skillId03',
  };
  const challengeData08_skill03_qcu_archive_notFlashCompatible_fr_noEmbedJson = {
    id: 'challengeId08',
    instruction: 'instruction challengeId08',
    alternativeInstruction: 'alternativeInstruction challengeId08',
    proposals: 'proposals challengeId08',
    type: 'QCU',
    solution: 'solution challengeId08',
    solutionToDisplay: 'solutionToDisplay challengeId08',
    t1Status: false,
    t2Status: false,
    t3Status: true,
    status: 'archivé',
    genealogy: 'genealogy challengeId08',
    accessibility1: 'accessibility1 challengeId08',
    accessibility2: 'accessibility2 challengeId08',
    requireGafamWebsiteAccess: false,
    isIncompatibleIpadCertif: false,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId08',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 10,
    shuffled: true,
    illustrationAlt: 'illustrationAlt challengeId08',
    illustrationUrl: 'illustrationUrl challengeId08',
    attachments: ['attachment1'],
    responsive: 'responsive challengeId08',
    alpha: null,
    delta: null,
    autoReply: false,
    focusable: true,
    format: 'format challengeId08',
    timer: null,
    embedHeight: null,
    embedUrl: 'embedUrl challengeId08',
    embedTitle: 'embedTitle challengeId08',
    locales: ['fr'],
    competenceId: 'competenceId01',
    skillId: 'skillId03',
  };
  const challengeData09_skill03_qcu_archive_flashCompatible_fr_noEmbedJson = {
    id: 'challengeId09',
    instruction: 'instruction challengeId09',
    alternativeInstruction: 'alternativeInstruction challengeId09',
    proposals: 'proposals challengeId09',
    type: 'QCU',
    solution: 'solution challengeId09',
    solutionToDisplay: 'solutionToDisplay challengeId09',
    t1Status: false,
    t2Status: false,
    t3Status: false,
    status: 'archivé',
    genealogy: 'genealogy challengeId09',
    accessibility1: 'accessibility1 challengeId09',
    accessibility2: 'accessibility2 challengeId09',
    requireGafamWebsiteAccess: true,
    isIncompatibleIpadCertif: false,
    deafAndHardOfHearing: 'deafAndHardOfHearing challengeId09',
    isAwarenessChallenge: true,
    toRephrase: false,
    alternativeVersion: 10,
    shuffled: true,
    illustrationAlt: 'illustrationAlt challengeId09',
    illustrationUrl: 'illustrationUrl challengeId09',
    attachments: ['attachment1'],
    responsive: 'responsive challengeId09',
    alpha: 1.0,
    delta: 2.0,
    autoReply: true,
    focusable: true,
    format: 'format challengeId09',
    timer: null,
    embedHeight: null,
    embedUrl: 'embedUrl challengeId09',
    embedTitle: 'embedTitle challengeId09',
    locales: ['fr'],
    competenceId: 'competenceId01',
    skillId: 'skillId03',
  };
  const skillData03_tube02competence01_actif = {
    id: 'skillId03',
    name: 'name skillId03',
    status: 'actif',
    pixValue: 5,
    version: 8,
    level: 7,
    hintStatus: 'hintStatus Acquis 3',
    competenceId: 'competenceId01',
    tubeId: 'tubeId03',
    tutorialIds: [],
    learningMoreTutorialIds: [],
    hint_i18n: { fr: 'hint FR skillId03', en: 'hint EN skillId03' },
  };

  beforeEach(async function () {
    databaseBuilder.factory.learningContent.build({
      skills: [
        skillData00_tube00competence00_actif,
        skillData01_tube01competence00_actif,
        skillData02_tube02competence01_perime,
        skillData03_tube02competence01_actif,
      ],
      challenges: [
        challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson,
        challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson,
        challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson,
        challengeData03_skill00_qcm_valide_flashCompatible_nl_noEmbedJson,
        challengeData04_skill01_qcu_valide_flashCompatible_ennl_noEmbedJson,
        challengeData05_skill02_qcm_perime_flashCompatible_fren_noEmbedJson,
        challengeData06_skill02_qcm_perime_notFlashCompatible_fren_noEmbedJson,
        challengeData07_skill03_qcm_valide_notFlashCompatible_frnl_noEmbedJson,
        challengeData08_skill03_qcu_archive_notFlashCompatible_fr_noEmbedJson,
        challengeData09_skill03_qcu_archive_flashCompatible_fr_noEmbedJson,
      ],
    });
    await databaseBuilder.commit();
  });

  describe('#getMany', function () {
    context('when no locale provided', function () {
      context('when at least one challenge is not found amongst the provided ids', function () {
        it('should throw a NotFound error', async function () {
          // when
          const err = await catchErr(calibratedChallengeRepository.getMany)([
            'challengeIdPipeauPipette',
            'challengeId00',
          ]);

          // then
          expect(err).to.be.instanceOf(NotFoundError);
          expect(err).to.have.property('message', 'Épreuve introuvable');
        });
      });

      context('when all challenges are found', function () {
        it('should return the challenges', async function () {
          // when
          const challenges = await calibratedChallengeRepository.getMany(['challengeId02', 'challengeId00']);

          // then
          expect(challenges).to.deepEqualArray([
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.id,
              blindnessCompatibility:
                challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.accessibility2,
              discriminant: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.alpha,
              difficulty: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.delta,
              competenceId: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: skillData00_tube00competence00_actif.id,
                name: skillData00_tube00competence00_actif.name,
                competenceId: skillData00_tube00competence00_actif.competenceId,
                tubeId: skillData00_tube00competence00_actif.tubeId,
              }),
            }),
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.id,
              blindnessCompatibility: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility2,
              discriminant: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.alpha,
              difficulty: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.delta,
              competenceId: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: skillData00_tube00competence00_actif.id,
                name: skillData00_tube00competence00_actif.name,
                competenceId: skillData00_tube00competence00_actif.competenceId,
                tubeId: skillData00_tube00competence00_actif.tubeId,
              }),
            }),
          ]);
        });

        it('should allow duplicates', async function () {
          // when
          const challenges = await calibratedChallengeRepository.getMany([
            'challengeId02',
            'challengeId00',
            'challengeId02',
          ]);

          // then
          expect(challenges).to.deepEqualArray([
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.id,
              blindnessCompatibility:
                challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.accessibility2,
              discriminant: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.alpha,
              difficulty: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.delta,
              competenceId: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: skillData00_tube00competence00_actif.id,
                name: skillData00_tube00competence00_actif.name,
                competenceId: skillData00_tube00competence00_actif.competenceId,
                tubeId: skillData00_tube00competence00_actif.tubeId,
              }),
            }),
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.id,
              blindnessCompatibility: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility2,
              discriminant: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.alpha,
              difficulty: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.delta,
              competenceId: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: skillData00_tube00competence00_actif.id,
                name: skillData00_tube00competence00_actif.name,
                competenceId: skillData00_tube00competence00_actif.competenceId,
                tubeId: skillData00_tube00competence00_actif.tubeId,
              }),
            }),
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.id,
              blindnessCompatibility: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility2,
              discriminant: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.alpha,
              difficulty: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.delta,
              competenceId: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: skillData00_tube00competence00_actif.id,
                name: skillData00_tube00competence00_actif.name,
                competenceId: skillData00_tube00competence00_actif.competenceId,
                tubeId: skillData00_tube00competence00_actif.tubeId,
              }),
            }),
          ]);
        });
      });
    });

    context('when locale is provided', function () {
      context('when at least one challenge is not found amongst the provided ids', function () {
        it('should throw a NotFound error', async function () {
          // when
          const err = await catchErr(calibratedChallengeRepository.getMany)([
            'challengeIdPipeauPipette',
            'challengeId00',
          ]);

          // then
          expect(err).to.be.instanceOf(NotFoundError);
          expect(err).to.have.property('message', 'Épreuve introuvable');
        });
      });

      context('when all challenges are found', function () {
        it('should return only the challenges for given locale', async function () {
          // when
          const challenges = await calibratedChallengeRepository.getMany(
            ['challengeId02', 'challengeId00', 'challengeId01'],
            'en',
          );

          // then
          expect(challenges).to.deepEqualArray([
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson.id,
              blindnessCompatibility:
                challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson.accessibility2,
              focused: challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson.focusable,
              discriminant: challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson.alpha,
              difficulty: challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson.delta,
              competenceId: challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: skillData00_tube00competence00_actif.id,
                name: skillData00_tube00competence00_actif.name,
                competenceId: skillData00_tube00competence00_actif.competenceId,
                tubeId: skillData00_tube00competence00_actif.tubeId,
              }),
            }),
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.id,
              blindnessCompatibility: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.accessibility2,
              focused: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.focusable,
              discriminant: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.alpha,
              difficulty: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.delta,
              competenceId: challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: skillData00_tube00competence00_actif.id,
                name: skillData00_tube00competence00_actif.name,
                competenceId: skillData00_tube00competence00_actif.competenceId,
                tubeId: skillData00_tube00competence00_actif.tubeId,
              }),
            }),
          ]);
        });
      });
    });
  });

  describe('#findActiveFlashCompatible', function () {
    let skillsLC = [];
    let challengesLC = [];

    beforeEach(async function () {
      await knex('learningcontent.challenges').truncate();
      await knex('learningcontent.skills').truncate();
      skillsLC = [];
      challengesLC = [];
      skillsLC.push(skillData02_tube02competence01_perime);
      skillsLC.push(skillData03_tube02competence01_actif);
      skillsLC.push(skillData00_tube00competence00_actif);
      challengesLC.push(challengeData06_skill02_qcm_perime_notFlashCompatible_fren_noEmbedJson);
      challengesLC.push(challengeData07_skill03_qcm_valide_notFlashCompatible_frnl_noEmbedJson);
      challengesLC.push(challengeData08_skill03_qcu_archive_notFlashCompatible_fr_noEmbedJson);
    });

    it('returns only valid calibrated flash compatible challenges', async function () {
      // given
      const candidateReconciliationDate = new Date('2025-01-01');

      const version = databaseBuilder.factory.buildCertificationVersion({ scope: Frameworks.CORE });
      const otherVersion = databaseBuilder.factory.buildCertificationVersion({
        scope: Frameworks.CORE,
      });

      challengesLC.push({
        id: 'challengeForComplementaryCertification',
        status: 'validé',
        skillId: skillData03_tube02competence01_actif.id,
      });
      challengesLC.push({
        id: 'otherChallengeForComplementaryCertification',
        status: 'validé',
        skillId: skillData03_tube02competence01_actif.id,
      });
      challengesLC.push(domainBuilder.buildChallenge({ id: 'toto', status: 'archivé' }));

      databaseBuilder.factory.learningContent.build({ skills: skillsLC, challenges: challengesLC });

      const certificationFrameworksChallenge = databaseBuilder.factory.buildCertificationFrameworksChallenge({
        challengeId: challengesLC[3].id,
        versionId: version.id,
      });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        challengeId: challengesLC[4].id,
        versionId: otherVersion.Id,
      });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        challengeId: challengesLC[0].id,
        versionId: otherVersion.id,
      });

      await databaseBuilder.commit();

      // when
      const flashCompatibleChallenges = await calibratedChallengeRepository.findActiveFlashCompatible({
        date: candidateReconciliationDate,
        locale: 'fr',
        version,
      });

      // then
      expect(flashCompatibleChallenges).to.have.lengthOf(1);
      expect(flashCompatibleChallenges[0].id).to.equal(challengesLC[3].id);
      expect(flashCompatibleChallenges[0].difficulty).to.equal(certificationFrameworksChallenge.difficulty);
      expect(flashCompatibleChallenges[0].discriminant).to.equal(certificationFrameworksChallenge.discriminant);
    });

    context('when locale is not defined', function () {
      it('should throw an Error', async function () {
        // given
        databaseBuilder.factory.learningContent.build({ skills: skillsLC, challenges: challengesLC });
        await databaseBuilder.commit();

        // when
        const err = await catchErr(calibratedChallengeRepository.findActiveFlashCompatible)();

        // then
        expect(err.message).to.equal('Locale shall be defined');
      });
    });

    context('when locale is defined', function () {
      context('when no active flash compatible challenges found', function () {
        it('should return an empty array', async function () {
          // given
          databaseBuilder.factory.learningContent.build({ skills: skillsLC, challenges: challengesLC });
          const version = databaseBuilder.factory.buildCertificationVersion();
          await databaseBuilder.commit();

          // when
          const challenges = await calibratedChallengeRepository.findActiveFlashCompatible({
            locale: 'fr',
            version,
          });

          // then
          expect(challenges).to.deep.equal([]);
        });
      });

      context('when active flash compatible challenges found', function () {
        it('should return the challenges', async function () {
          // given
          challengesLC.push(challengeData01_skill00_qcu_valide_flashCompatible_fren_withEmbedJson);
          challengesLC.push(challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson);
          challengesLC.push(challengeData03_skill00_qcm_valide_flashCompatible_nl_noEmbedJson);
          challengesLC.push(challengeData02_skill00_qcm_archive_flashCompatible_en_noEmbedJson);
          challengesLC.push(challengeData09_skill03_qcu_archive_flashCompatible_fr_noEmbedJson);
          databaseBuilder.factory.learningContent.build({ skills: skillsLC, challenges: challengesLC });
          const version = databaseBuilder.factory.buildCertificationVersion();

          databaseBuilder.factory.buildCertificationFrameworksChallenge({
            challengeId: challengesLC[3].id,
            versionId: version.id,
          });

          const certificationFrameworkChallenge = databaseBuilder.factory.buildCertificationFrameworksChallenge({
            challengeId: challengesLC[4].id,
            versionId: version.id,
          });

          await databaseBuilder.commit();

          // when
          const challenges = await calibratedChallengeRepository.findActiveFlashCompatible({
            locale: 'nl',
            version,
          });

          // then
          expect(challenges).to.deep.equal([
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              id: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.id,
              blindnessCompatibility:
                challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.accessibility1,
              colorBlindnessCompatibility:
                challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.accessibility2,
              discriminant: certificationFrameworkChallenge.discriminant,
              difficulty: certificationFrameworkChallenge.difficulty,
              competenceId: challengeData00_skill00_qcu_valide_flashCompatible_frnl_noEmbedJson.competenceId,
              skill: domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({
                id: 'skillId00',
                name: 'name skillId00',
                competenceId: 'competenceId00',
                tubeId: 'tubeId00',
              }),
            }),
          ]);
        });
      });
    });
  });
});
