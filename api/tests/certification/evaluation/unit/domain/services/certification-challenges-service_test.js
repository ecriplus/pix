import _ from 'lodash';

import * as certificationChallengesService from '../../../../../../src/certification/evaluation/domain/services/certification-challenges-service.js';
import { PlacementProfile } from '../../../../../../src/shared/domain/models/PlacementProfile.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Service | Certification Challenge Service', function () {
  const userId = 63731;
  const locale = 'fr-fr';

  let competenceFlipper;
  let competenceRemplir;
  let competenceRequin;
  let competenceKoala;

  let skillCitation4;
  let skillCollaborer4;
  let skillMoteur3;
  let skillRecherche4;
  let skillRemplir2;
  let skillRemplir2Focus;
  let skillRemplir4;
  let skillUrl3;
  let skillWeb1;
  let skillRequin5;
  let skillRequin8;
  let skillKoala1;
  let skillKoala2;

  let challengeForSkillCollaborer4;
  let challengeForSkillCitation4;
  let challengeForSkillRecherche4;
  let challengeRecordWithoutSkills;
  let anotherChallengeForSkillCitation4;
  let challengeForSkillKoala1;
  let challengeForSkillKoala2;
  let challengeForSkillRemplir2;
  let challengeForSkillRemplir2Focus;
  let challengeForSkillRemplir4;
  let challengeForSkillUrl3;
  let challengeForSkillWeb1;
  let challengeForSkillRequin5;
  let challengeForSkillRequin8;

  function _createCertificationChallenge(challengeId, skill, certifiableBadgeKey = null) {
    if (certifiableBadgeKey) {
      return domainBuilder.buildCertificationChallenge.forPixPlusCertification({
        challengeId,
        associatedSkillName: skill.name,
        associatedSkillId: skill.id,
        competenceId: skill.competenceId,
        isNeutralized: false,
        certifiableBadgeKey,
      });
    }
    return domainBuilder.buildCertificationChallenge.forPixCertification({
      challengeId,
      associatedSkillName: skill.name,
      associatedSkillId: skill.id,
      competenceId: skill.competenceId,
      isNeutralized: false,
      certifiableBadgeKey,
    });
  }

  beforeEach(function () {
    competenceFlipper = domainBuilder.buildCompetence({
      id: 'competenceRecordIdOne',
      index: '1.1',
      name: '1.1 Construire un flipper',
    });
    competenceRemplir = domainBuilder.buildCompetence({
      id: 'competenceRecordIdTwo',
      index: '1.2',
      name: '1.2 Adopter un dauphin',
    });
    competenceRequin = domainBuilder.buildCompetence({
      id: 'competenceRecordIdThree',
      index: '1.3',
      name: '1.3 Se faire manger par un requin',
    });
    competenceKoala = domainBuilder.buildCompetence({
      id: 'competenceRecordIdKoala',
      index: '1.3',
      name: '1.3 Se faire manger par un koala',
    });

    skillCitation4 = domainBuilder.buildSkill({
      id: 10,
      name: '@citation4',
      difficulty: 4,
      competenceId: competenceFlipper.id,
    });
    skillCollaborer4 = domainBuilder.buildSkill({
      id: 20,
      name: '@collaborer4',
      difficulty: 4,
      competenceId: competenceFlipper.id,
    });
    skillMoteur3 = domainBuilder.buildSkill({
      id: 30,
      name: '@moteur3',
      difficulty: 3,
      competenceId: competenceFlipper.id,
    });
    skillRecherche4 = domainBuilder.buildSkill({
      id: 40,
      name: '@recherche4',
      difficulty: 4,
      competenceId: competenceFlipper.id,
    });
    skillRemplir2 = domainBuilder.buildSkill({
      id: 50,
      name: '@remplir2',
      difficulty: 2,
      competenceId: competenceRemplir.id,
      version: 1,
    });
    skillRemplir2Focus = domainBuilder.buildSkill({
      id: 1789,
      name: '@remplir2',
      difficulty: 2,
      competenceId: competenceRemplir.id,
      version: 2,
    });
    skillRemplir4 = domainBuilder.buildSkill({
      id: 60,
      name: '@remplir4',
      difficulty: 4,
      competenceId: competenceRemplir.id,
    });
    skillUrl3 = domainBuilder.buildSkill({ id: 70, name: '@url3', difficulty: 3, competenceId: competenceRemplir.id });
    skillWeb1 = domainBuilder.buildSkill({ id: 80, name: '@web1', difficulty: 1, competenceId: competenceRemplir.id });
    skillRequin5 = domainBuilder.buildSkill({
      id: 110,
      name: '@requin5',
      difficulty: 5,
      competenceId: competenceRequin.id,
    });
    skillRequin8 = domainBuilder.buildSkill({
      id: 120,
      name: '@requin7',
      difficulty: 7,
      competenceId: competenceRequin.id,
    });
    skillKoala1 = domainBuilder.buildSkill({
      id: 110,
      name: '@koala1',
      difficulty: 1,
      competenceId: competenceKoala.id,
    });
    skillKoala2 = domainBuilder.buildSkill({
      id: 120,
      name: '@koala2',
      difficulty: 2,
      competenceId: competenceKoala.id,
    });

    challengeForSkillCollaborer4 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdThree',
      competenceId: 'competenceRecordIdThatDoesNotExistAnymore',
      skill: skillCollaborer4,
    });
    challengeForSkillCitation4 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdOne',
      competenceId: competenceFlipper.id,
      skill: skillCitation4,
    });
    challengeForSkillRecherche4 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdFour',
      competenceId: competenceFlipper.id,
      skill: skillRecherche4,
    });
    challengeRecordWithoutSkills = domainBuilder.buildChallenge({
      id: 'challengeRecordIdNine',
      competenceId: competenceFlipper.id,
      skill: null,
    });
    anotherChallengeForSkillCitation4 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdTen',
      competenceId: competenceFlipper.id,
      skill: skillCitation4,
    });
    challengeForSkillKoala1 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdKoala1',
      competenceId: competenceKoala.id,
      skill: skillKoala1,
    });
    challengeForSkillKoala2 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdKoala2',
      competenceId: competenceKoala.id,
      skill: skillKoala2,
    });
    challengeForSkillRemplir2 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdFive',
      competenceId: competenceRemplir.id,
      skill: skillRemplir2,
    });
    challengeForSkillRemplir2Focus = domainBuilder.buildChallenge({
      id: 'challengeRecordIdFiveFocus',
      competenceId: competenceRemplir.id,
      skill: skillRemplir2Focus,
    });
    domainBuilder.buildChallenge({
      id: 'anotherChallengeForSkillRemplir2',
      competenceId: competenceRemplir.id,
      skill: skillRemplir2,
    });
    challengeForSkillRemplir4 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdSix',
      competenceId: competenceRemplir.id,
      skill: skillRemplir4,
    });
    challengeForSkillUrl3 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdSeven',
      competenceId: competenceRemplir.id,
      skill: skillUrl3,
    });
    challengeForSkillWeb1 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdEight',
      competenceId: competenceRemplir.id,
      skill: skillWeb1,
    });
    challengeForSkillRequin5 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdNine',
      competenceId: competenceRequin.id,
      skill: skillRequin5,
    });
    challengeForSkillRequin8 = domainBuilder.buildChallenge({
      id: 'challengeRecordIdTen',
      competenceId: competenceRequin.id,
      skill: skillRequin8,
    });
  });

  describe('#pickCertificationChallenges', function () {
    let placementProfile;
    let userCompetence1;
    let userCompetence2;
    let challengeRepository;
    let knowledgeElementRepository;
    let answerRepository;

    beforeEach(function () {
      challengeRepository = { findOperative: sinon.stub() };
      knowledgeElementRepository = { findUniqByUserIdGroupedByCompetenceId: sinon.stub() };
      answerRepository = { findChallengeIdsFromAnswerIds: sinon.stub() };

      challengeRepository.findOperative
        .withArgs(locale)
        .resolves([
          challengeForSkillCitation4,
          anotherChallengeForSkillCitation4,
          challengeForSkillCollaborer4,
          challengeForSkillRecherche4,
          challengeForSkillRemplir2,
          challengeForSkillRemplir2Focus,
          challengeForSkillRemplir4,
          challengeForSkillUrl3,
          challengeForSkillWeb1,
          challengeRecordWithoutSkills,
          challengeForSkillRequin5,
          challengeForSkillRequin8,
          challengeForSkillKoala1,
          challengeForSkillKoala2,
        ]);
      userCompetence1 = domainBuilder.buildUserCompetence({
        id: 'competenceRecordIdOne',
        index: '1.1',
        name: '1.1 Construire un flipper',
        pixScore: 12,
        estimatedLevel: 1,
      });
      userCompetence2 = domainBuilder.buildUserCompetence({
        id: 'competenceRecordIdTwo',
        index: '1.2',
        name: '1.2 Adopter un dauphin',
        pixScore: 23,
        estimatedLevel: 2,
      });

      placementProfile = new PlacementProfile({
        userId,
        userCompetences: [],
        profileDate: 'limitDate',
      });
    });

    it('should assign skill to related competence', async function () {
      // given
      placementProfile.userCompetences = [
        domainBuilder.buildUserCompetence({
          ...userCompetence2,
          skills: [skillRemplir2],
        }),
      ];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 123,
            competenceId: competenceRemplir.id,
            skillId: skillRemplir2.id,
          }),
        ]);

      answerRepository.findChallengeIdsFromAnswerIds.withArgs([123]).resolves(['challengeRecordIdFive']);
      const expectedCertificationChallenge = _createCertificationChallenge(challengeForSkillRemplir2.id, skillRemplir2);

      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal([expectedCertificationChallenge]);
    });

    context('when competence level is less than 1', function () {
      it('should select no challenge', async function () {
        // given
        const userCompetenceWithLowLevel = domainBuilder.buildUserCompetence({
          ...userCompetence1,
          pixScore: 5,
          estimatedLevel: 0,
        });
        placementProfile.userCompetences = [userCompetenceWithLowLevel];

        knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
          .withArgs({ userId, limitDate: 'limitDate' })
          .resolves([
            domainBuilder.buildKnowledgeElement({
              answerId: 123,
              earnedPix: 5,
              competenceId: userCompetenceWithLowLevel.id,
            }),
          ]);
        answerRepository.findChallengeIdsFromAnswerIds.withArgs([123]).resolves(['whatever']);

        // when
        const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
          placementProfile,
          locale,
          knowledgeElementRepository,
          answerRepository,
          challengeRepository,
        );

        // then
        expect(certificationChallenges).to.deep.equal([]);
      });
    });

    context('when no challenge validate the skill', function () {
      it('should not return the skill', async function () {
        // given
        placementProfile.userCompetences = [userCompetence2];
        knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
          .withArgs({ userId, limitDate: 'limitDate' })
          .resolves([domainBuilder.buildKnowledgeElement({ answerId: 123 })]);
        answerRepository.findChallengeIdsFromAnswerIds.withArgs([123]).resolves(['challengeRecordIdEleven']);

        // when
        const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
          placementProfile,
          locale,
          knowledgeElementRepository,
          answerRepository,
          challengeRepository,
        );

        // then
        expect(certificationChallenges).to.deep.equal([]);
      });
    });

    context('when three challenges validate the same skill', function () {
      it('should select an unanswered challenge', async function () {
        // given
        placementProfile.userCompetences = [
          domainBuilder.buildUserCompetence({
            ...userCompetence1,
            skills: [skillCitation4],
          }),
        ];
        knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
          .withArgs({ userId, limitDate: 'limitDate' })
          .resolves([
            domainBuilder.buildKnowledgeElement({
              answerId: 1,
              competenceId: competenceFlipper.id,
              skillId: challengeForSkillCitation4.skill.id,
            }),
          ]);
        answerRepository.findChallengeIdsFromAnswerIds.withArgs([1]).resolves(['challengeRecordIdOne']);

        // when
        const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
          placementProfile,
          locale,
          knowledgeElementRepository,
          answerRepository,
          challengeRepository,
        );

        // then
        expect(certificationChallenges[0].challengeId).to.be.oneOf(['challengeRecordIdTen', 'challengeRecordIdTwo']);
      });

      it('should select a challenge for every skill', async function () {
        // given
        placementProfile.userCompetences = [
          domainBuilder.buildUserCompetence({
            ...userCompetence1,
            skills: [skillRecherche4, skillCitation4, skillMoteur3],
          }),
        ];
        knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
          .withArgs({ userId, limitDate: 'limitDate' })
          .resolves([
            domainBuilder.buildKnowledgeElement({
              answerId: 123,
              competenceId: competenceFlipper.id,
              skillId: challengeForSkillRecherche4.skill.id,
            }),
          ]);
        answerRepository.findChallengeIdsFromAnswerIds
          .withArgs([123])
          .resolves(['challengeRecordIdFour', 'challengeRecordIdTwo']);
        const expectedSkills = [skillCitation4.name, skillRecherche4.name];

        // when
        const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
          placementProfile,
          locale,
          knowledgeElementRepository,
          answerRepository,
          challengeRepository,
        );

        // then
        const skillsForChallenges = _.uniq(_.map(certificationChallenges, 'associatedSkillName'));
        expect(skillsForChallenges).to.deep.include.members(expectedSkills);
      });

      it('should return at most one challenge per skill', async function () {
        // given
        placementProfile.userCompetences = [
          domainBuilder.buildUserCompetence({
            ...userCompetence1,
            skills: [skillRecherche4, skillCitation4, skillMoteur3],
          }),
        ];
        knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
          .withArgs({ userId, limitDate: 'limitDate' })
          .resolves([
            domainBuilder.buildKnowledgeElement({
              answerId: 123,
              competenceId: competenceFlipper.id,
              skillId: challengeForSkillRecherche4.skill.id,
            }),
          ]);
        answerRepository.findChallengeIdsFromAnswerIds
          .withArgs([123])
          .resolves(['challengeRecordIdFour', 'challengeRecordIdTwo']);
        const expectedSkills = [skillCitation4, skillRecherche4];

        // when
        const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
          placementProfile,
          locale,
          knowledgeElementRepository,
          answerRepository,
          challengeRepository,
        );

        // then
        const skillsForChallenges = _.uniq(_.map(certificationChallenges, 'associatedSkillName'));
        expect(skillsForChallenges).to.have.lengthOf(expectedSkills.length);
      });
    });

    it('should group skills by competence', async function () {
      // given
      placementProfile.userCompetences = [
        domainBuilder.buildUserCompetence({
          ...userCompetence1,
          skills: [skillRecherche4],
        }),
        domainBuilder.buildUserCompetence({
          ...userCompetence2,
          skills: [skillRemplir2, skillUrl3],
        }),
      ];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 123,
            competenceId: competenceFlipper.id,
            skillId: challengeForSkillRecherche4.skill.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 456,
            competenceId: competenceRemplir.id,
            skillId: challengeForSkillUrl3.skill.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 789,
            competenceId: competenceRemplir.id,
            skillId: challengeForSkillRemplir2.skill.id,
          }),
        ]);
      answerRepository.findChallengeIdsFromAnswerIds
        .withArgs([123, 456, 789])
        .resolves([challengeForSkillRecherche4.id, challengeForSkillUrl3.id, challengeForSkillRemplir2.id]);
      const expectedCertificationChallenges = [
        _createCertificationChallenge(challengeForSkillRecherche4.id, skillRecherche4),
        _createCertificationChallenge(challengeForSkillUrl3.id, skillUrl3),
        _createCertificationChallenge(challengeForSkillRemplir2.id, skillRemplir2),
      ];

      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal(expectedCertificationChallenges);
    });

    it('should sort in desc grouped skills by competence', async function () {
      // given
      placementProfile.userCompetences = [
        userCompetence1,
        domainBuilder.buildUserCompetence({
          ...userCompetence2,
          skills: [skillRemplir2, skillUrl3, skillRemplir4],
        }),
      ];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 123,
            competenceId: competenceRemplir.id,
            skillId: skillRemplir4.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 456,
            competenceId: competenceRemplir.id,
            skillId: skillRemplir2.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 789,
            competenceId: competenceRemplir.id,
            skillId: skillUrl3.id,
          }),
        ]);
      answerRepository.findChallengeIdsFromAnswerIds
        .withArgs([123, 456, 789])
        .resolves(['challengeRecordIdSix', 'challengeRecordIdFive', 'challengeRecordIdSeven']);
      const expectedCertificationChallenges = [
        _createCertificationChallenge(challengeForSkillRemplir4.id, skillRemplir4),
        _createCertificationChallenge(challengeForSkillUrl3.id, skillUrl3),
        _createCertificationChallenge(challengeForSkillRemplir2.id, skillRemplir2),
      ];

      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal(expectedCertificationChallenges);
    });

    it('should return the three most difficult skills sorted in desc grouped by competence', async function () {
      // given
      placementProfile.userCompetences = [
        domainBuilder.buildUserCompetence({
          ...userCompetence1,
        }),
        domainBuilder.buildUserCompetence({
          ...userCompetence2,
          skills: [skillRemplir2, skillRemplir4, skillUrl3, skillWeb1],
        }),
      ];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 1,
            competenceId: competenceRemplir.id,
            skillId: challengeForSkillRemplir4.skill.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 2,
            competenceId: competenceRemplir.id,
            skillId: challengeForSkillRemplir2.skill.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 3,
            competenceId: competenceRemplir.id,
            skillId: challengeForSkillUrl3.skill.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 4,
            competenceId: competenceRemplir.id,
            skillId: challengeForSkillWeb1.skill.id,
          }),
        ]);
      answerRepository.findChallengeIdsFromAnswerIds
        .withArgs([1, 2, 3, 4])
        .resolves([
          challengeForSkillRemplir4.id,
          challengeForSkillRemplir2.id,
          challengeForSkillUrl3.id,
          challengeForSkillWeb1.id,
        ]);
      const expectedCertificationChallenges = [
        _createCertificationChallenge(challengeForSkillRemplir4.id, skillRemplir4),
        _createCertificationChallenge(challengeForSkillUrl3.id, skillUrl3),
        _createCertificationChallenge(challengeForSkillRemplir2.id, skillRemplir2),
      ];

      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal(expectedCertificationChallenges);
    });

    it('should not add a skill with a given id twice', async function () {
      // given
      placementProfile.userCompetences = [
        userCompetence1,
        domainBuilder.buildUserCompetence({
          ...userCompetence2,
          skills: [skillRemplir2],
        }),
      ];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 1,
            competenceId: competenceRemplir.id,
            skillId: skillRemplir2.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 2,
            competenceId: competenceRemplir.id,
            skillId: skillRemplir2.id,
          }),
        ]);
      answerRepository.findChallengeIdsFromAnswerIds
        .withArgs([1, 2])
        .resolves(['challengeRecordIdFive', 'anotherChallengeForSkillRemplir2']);
      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal([
        _createCertificationChallenge(challengeForSkillRemplir2.id, skillRemplir2),
      ]);
    });

    it('should not add a skill with a given name twice', async function () {
      // given
      expect(skillRemplir2.version).to.deep.equal(1);
      expect(skillRemplir2Focus.version).to.deep.equal(2);
      placementProfile.userCompetences = [
        userCompetence1,
        domainBuilder.buildUserCompetence({
          ...userCompetence2,
          skills: [skillRemplir2, skillRemplir2Focus],
        }),
      ];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 1,
            competenceId: competenceRemplir.id,
            skillId: skillRemplir2.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 2,
            competenceId: competenceRemplir.id,
            skillId: skillRemplir2Focus.id,
          }),
        ]);
      answerRepository.findChallengeIdsFromAnswerIds
        .withArgs([1, 2])
        .resolves(['challengeRecordIdFive', 'anotherChallengeForSkillRemplir2']);

      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal([
        _createCertificationChallenge(challengeForSkillRemplir2Focus.id, skillRemplir2Focus),
      ]);
    });

    it('should not assign skill, when the challenge id is not found', async function () {
      // given
      placementProfile.userCompetences = [userCompetence1, userCompetence2];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([domainBuilder.buildKnowledgeElement({ answerId: 1 })]);
      answerRepository.findChallengeIdsFromAnswerIds.withArgs([1]).resolves(['nonExistentchallengeRecordId']);
      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal([]);
    });

    it('should not assign skill, when the competence is not found', async function () {
      // given
      placementProfile.userCompetences = [userCompetence1, userCompetence2];
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([domainBuilder.buildKnowledgeElement({ answerId: 1 })]);
      answerRepository.findChallengeIdsFromAnswerIds.withArgs([1]).resolves(['challengeRecordIdThree']);
      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      expect(certificationChallenges).to.deep.equal([]);
    });

    it('should avoid skills of same tube if there is same level challenge alternative', async function () {
      // given
      const toto6 = domainBuilder.buildSkill({
        id: 'toto6',
        name: '@toto6',
        difficulty: 6,
        tubeId: 'totoId',
        competenceId: 'competenceId',
      });
      const toto5 = domainBuilder.buildSkill({
        id: 'toto5',
        name: '@toto5',
        difficulty: 5,
        tubeId: 'totoId',
        competenceId: 'competenceId',
      });
      const toto4 = domainBuilder.buildSkill({
        id: 'toto4',
        name: '@toto4',
        difficulty: 4,
        tubeId: 'totoId',
        competenceId: 'competenceId',
      });
      const zaza4 = domainBuilder.buildSkill({
        id: 'zaza4',
        name: '@zaza4',
        difficulty: 4,
        tubeId: 'zazaId',
        competenceId: 'competenceId',
      });
      const userCompetence = domainBuilder.buildUserCompetence({
        id: 'competenceId',
        index: '1.2',
        area: { code: '1' },
        name: '1.2 Adopter un dauphin',
        pixScore: 23,
        estimatedLevel: 2,
      });
      placementProfile.userCompetences = [
        domainBuilder.buildUserCompetence({
          ...userCompetence,
          skills: [toto6, toto5, toto4, zaza4],
        }),
      ];

      challengeRepository.findOperative
        .withArgs(locale)
        .resolves([
          domainBuilder.buildChallenge({ id: 'challengeToto6', competenceId: 'competenceId', skill: toto6 }),
          domainBuilder.buildChallenge({ id: 'challengeToto5', competenceId: 'competenceId', skill: toto5 }),
          domainBuilder.buildChallenge({ id: 'challengeToto4', competenceId: 'competenceId', skill: toto4 }),
          domainBuilder.buildChallenge({ id: 'challengeZaza4', competenceId: 'competenceId', skill: zaza4 }),
        ]);
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 123,
            competenceId: 'competenceId',
            skillId: toto6.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 456,
            competenceId: 'competenceId',
            skillId: toto5.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 789,
            competenceId: 'competenceId',
            skillId: toto4.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 257,
            competenceId: 'competenceId',
            skillId: zaza4.id,
          }),
        ]);
      answerRepository.findChallengeIdsFromAnswerIds
        .withArgs([123, 456, 789, 257])
        .resolves(['challengeToto6', 'challengeToto5', 'challengeToto4', 'challengeZaza4']);

      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      const expectedCertificationChallenges = [
        _createCertificationChallenge('challengeToto6', toto6),
        _createCertificationChallenge('challengeToto5', toto5),
        _createCertificationChallenge('challengeZaza4', zaza4),
      ];
      expect(certificationChallenges).to.deep.equal(expectedCertificationChallenges);
    });

    it('should not avoid skills of same tube if there is no challenge alternative', async function () {
      // given
      const toto6 = domainBuilder.buildSkill({
        id: 'toto6',
        name: '@toto6',
        difficulty: 6,
        tubeId: 'totoId',
        competenceId: 'competenceId',
      });
      const toto5 = domainBuilder.buildSkill({
        id: 'toto5',
        name: '@toto5',
        difficulty: 5,
        tubeId: 'totoId',
        competenceId: 'competenceId',
      });
      const mama5 = domainBuilder.buildSkill({
        id: 'mama5',
        name: '@mama5',
        difficulty: 5,
        tubeId: 'mamaId',
        competenceId: 'competenceId',
      });
      const toto4 = domainBuilder.buildSkill({
        id: 'toto4',
        name: '@toto4',
        difficulty: 4,
        tubeId: 'totoId',
        competenceId: 'competenceId',
      });
      const zaza4 = domainBuilder.buildSkill({
        id: 'zaza4',
        name: '@zaza4',
        difficulty: 4,
        tubeId: 'zazaId',
        competenceId: 'competenceId',
      });

      const userCompetence = domainBuilder.buildUserCompetence({
        id: 'competenceId',
        index: '1.2',
        area: { code: '1' },
        name: '1.2 Adopter un dauphin',
        pixScore: 23,
        estimatedLevel: 2,
      });
      placementProfile.userCompetences = [
        domainBuilder.buildUserCompetence({
          ...userCompetence,
          skills: [toto6, toto5, toto4, mama5, zaza4],
        }),
      ];

      challengeRepository.findOperative
        .withArgs(locale)
        .resolves([
          domainBuilder.buildChallenge({ id: 'challengeToto6', competenceId: 'competenceId', skill: toto6 }),
          domainBuilder.buildChallenge({ id: 'challengeToto5', competenceId: 'competenceId', skill: toto5 }),
          domainBuilder.buildChallenge({ id: 'challengeToto4', competenceId: 'competenceId', skill: toto4 }),
          domainBuilder.buildChallenge({ id: 'challengeZaza4', competenceId: 'competenceId', skill: zaza4 }),
          domainBuilder.buildChallenge({ id: 'challengeMama5', competenceId: 'competenceId', skill: mama5 }),
        ]);
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: 'limitDate' })
        .resolves([
          domainBuilder.buildKnowledgeElement({
            answerId: 123,
            competenceId: 'competenceId',
            skillId: toto6.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 456,
            competenceId: 'competenceId',
            skillId: toto5.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 789,
            competenceId: 'competenceId',
            skillId: toto4.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 257,
            competenceId: 'competenceId',
            skillId: zaza4.id,
          }),
          domainBuilder.buildKnowledgeElement({
            answerId: 245,
            competenceId: 'competenceId',
            skillId: mama5.id,
          }),
        ]);
      answerRepository.findChallengeIdsFromAnswerIds
        .withArgs([123, 456, 789, 257, 245])
        .resolves(['challengeToto6', 'challengeToto5', 'challengeToto4', 'challengeZaza4', 'challengeMama5']);

      // when
      const certificationChallenges = await certificationChallengesService.pickCertificationChallenges(
        placementProfile,
        locale,
        knowledgeElementRepository,
        answerRepository,
        challengeRepository,
      );

      // then
      const expectedCertificationChallenges = [
        _createCertificationChallenge('challengeToto6', toto6),
        _createCertificationChallenge('challengeMama5', mama5),
        _createCertificationChallenge('challengeToto5', toto5),
      ];
      expect(certificationChallenges).to.deep.equal(expectedCertificationChallenges);
    });
  });
});
