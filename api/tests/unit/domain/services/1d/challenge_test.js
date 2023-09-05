import { expect, sinon, catchErr, domainBuilder } from '../../../../test-helper.js';
import { NotFoundError } from '../../../../../lib/domain/errors.js';
import { challengeService } from '../../../../../lib/domain/services/1d/challenge.js';
import { Activity } from '../../../../../lib/domain/models/index.js';

describe('Unit | Service | Challenge', function () {
  describe('#getChallenge', function () {
    it('calls challengeRepository#getChallengeFor1d with goods arguments', function () {
      const missionId = 'mission_id';
      const activityLevel = Activity.levels.TRAINING;
      const challengeNumber = 1;
      const alternativeVersion = null;
      const challengeRepository = {
        getChallengeFor1d: sinon.stub(),
      };

      challengeService.getChallenge({
        missionId,
        activityLevel,
        challengeNumber,
        alternativeVersion,
        challengeRepository,
      });

      expect(challengeRepository.getChallengeFor1d).to.have.been.calledOnceWith({
        missionId,
        activityLevel,
        challengeNumber,
      });
    });
    context('alternativeVersion', function () {
      it('returns the challenge corresponding to the alternative version', async function () {
        const missionId = 'mission_id';
        const activityLevel = Activity.levels.TRAINING;
        const challengeNumber = 1;
        const alternativeVersion = 2;
        const challengeRepository = {
          getChallengeFor1d: sinon.stub(),
        };
        const challenge1 = domainBuilder.buildChallenge({ alternativeVersion });
        const challenge2 = domainBuilder.buildChallenge({ alternativeVersion: 3 });
        const challenges = [challenge1, challenge2];
        challengeRepository.getChallengeFor1d.resolves(challenges);
        const result = await challengeService.getChallenge({
          missionId,
          activityLevel,
          challengeNumber,
          alternativeVersion,
          challengeRepository,
        });

        expect(result).to.equal(challenge1);
      });
      it('when the given alternativeVersion equals to 0, it should returns the challenge with the alternativeVersion equals to undefined', async function () {
        const missionId = 'mission_id';
        const activityLevel = Activity.levels.TRAINING;
        const challengeNumber = 1;
        const alternativeVersion = 0;
        const challengeRepository = {
          getChallengeFor1d: sinon.stub(),
        };
        const challenge1 = domainBuilder.buildChallenge({ alternativeVersion: undefined });
        const challenge2 = domainBuilder.buildChallenge({ alternativeVersion: 3 });
        const challenges = [challenge1, challenge2];
        challengeRepository.getChallengeFor1d.resolves(challenges);
        const result = await challengeService.getChallenge({
          missionId,
          activityLevel,
          challengeNumber,
          alternativeVersion,
          challengeRepository,
        });

        expect(result).to.equal(challenge1);
      });
    });
    it('does not throw an error with a NotFoundError', async function () {
      const missionId = 'mission_id';
      const activityLevel = Activity.levels.TRAINING;
      const challengeNumber = 1;
      const alternativeVersion = null;
      const challengeRepository = {
        getChallengeFor1d: sinon.stub(),
      };

      challengeRepository.getChallengeFor1d.rejects(new NotFoundError());

      const functionToCall = async () => {
        await challengeService.getChallenge({
          missionId,
          activityLevel,
          challengeNumber,
          alternativeVersion,
          challengeRepository,
        });
      };
      expect(functionToCall).to.not.throw();
    });
    it('throws an error when the error is not a NotFoundError', async function () {
      const missionId = 'mission_id';
      const activityLevel = Activity.levels.TRAINING;
      const challengeNumber = 1;
      const alternativeVersion = null;
      const challengeRepository = {
        getChallengeFor1d: sinon.stub(),
      };

      challengeRepository.getChallengeFor1d.rejects(new Error());
      const error = await catchErr(challengeService.getChallenge)({
        missionId,
        activityLevel,
        challengeNumber,
        alternativeVersion,
        challengeRepository,
      });
      expect(error).not.to.be.instanceOf(NotFoundError);
    });
  });

  describe('#getStartChallenge', function () {
    it('calls challengeRepository#getChallengeFor1d with goods arguments', function () {
      const missionId = 'mission_id';
      const activityLevel = Activity.levels.TRAINING;
      const challengeNumber = 1;
      const challengeRepository = {
        getChallengeFor1d: sinon.stub(),
      };

      challengeService.getStartChallenge({
        missionId,
        activityLevel,
        challengeNumber,
        challengeRepository,
      });

      expect(challengeRepository.getChallengeFor1d).to.have.been.calledOnceWith({
        missionId,
        activityLevel,
        challengeNumber,
      });
    });
    it('returns a challenge randomly', async function () {
      const missionId = 'mission_id';
      const activityLevel = Activity.levels.TRAINING;
      const challengeNumber = 1;
      const alternativeVersion = 2;
      const challengeRepository = {
        getChallengeFor1d: sinon.stub(),
      };
      const challenge1 = domainBuilder.buildChallenge({ alternativeVersion });
      const challenge2 = domainBuilder.buildChallenge({ alternativeVersion: 3 });
      const challenges = [challenge1, challenge2];
      challengeRepository.getChallengeFor1d.resolves(challenges);

      sinon.stub(Math, 'random').returns(0.6);
      const result = await challengeService.getStartChallenge({
        missionId,
        activityLevel,
        challengeNumber,
        challengeRepository,
      });

      expect(result).to.equal(challenge2);
    });
    it('does not throw an error with a NotFoundError', async function () {
      const missionId = 'mission_id';
      const activityLevel = Activity.levels.TRAINING;
      const challengeNumber = 1;
      const alternativeVersion = null;
      const challengeRepository = {
        getChallengeFor1d: sinon.stub(),
      };

      challengeRepository.getChallengeFor1d.rejects(new NotFoundError());

      const functionToCall = async () => {
        await challengeService.getStartChallenge({
          missionId,
          activityLevel,
          challengeNumber,
          alternativeVersion,
          challengeRepository,
        });
      };
      expect(functionToCall).to.not.throw();
    });
    it('throws an error when the error is not a NotFoundError', async function () {
      const missionId = 'mission_id';
      const activityLevel = Activity.levels.TRAINING;
      const challengeNumber = 1;
      const alternativeVersion = null;
      const challengeRepository = {
        getChallengeFor1d: sinon.stub(),
      };

      challengeRepository.getChallengeFor1d.rejects(new Error());
      const error = await catchErr(challengeService.getStartChallenge)({
        missionId,
        activityLevel,
        challengeNumber,
        alternativeVersion,
        challengeRepository,
      });
      expect(error).not.to.be.instanceOf(NotFoundError);
    });
  });
});