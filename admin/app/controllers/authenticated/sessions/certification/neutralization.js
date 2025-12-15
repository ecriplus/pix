import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NeutralizationController extends Controller {
  @service pixToast;
  @service accessControl;

  get certificationDetails() {
    return this.model;
  }

  @action
  async neutralize(challengeRecId, questionIndex) {
    try {
      await this.certificationDetails.save({
        adapterOptions: {
          isNeutralizeChallenge: true,
          certificationCourseId: this.certificationDetails.id,
          challengeRecId,
        },
      });
      this._updateModel(challengeRecId, true);
      return this.pixToast.sendSuccessNotification({
        message: `La question n°${questionIndex} a été neutralisée avec succès.`,
      });
    } catch {
      return this.pixToast.sendErrorNotification({
        message: `Une erreur est survenue lors de la neutralisation de la question n°${questionIndex}.`,
      });
    }
  }

  @action
  async deneutralize(challengeRecId, questionIndex) {
    try {
      await this.certificationDetails.save({
        adapterOptions: {
          isDeneutralizeChallenge: true,
          certificationCourseId: this.certificationDetails.id,
          challengeRecId,
        },
      });
      this._updateModel(challengeRecId, false);
      return this.pixToast.sendSuccessNotification({
        message: `La question n°${questionIndex} a été dé-neutralisée avec succès.`,
      });
    } catch {
      return this.pixToast.sendErrorNotification({
        message: `Une erreur est survenue lors de la dé-neutralisation de la question n°${questionIndex}.`,
      });
    }
  }

  _updateModel(challengeRecId, neutralized) {
    const updatedChallenges = this.certificationDetails.listChallengesAndAnswers.map((challenge) => {
      if (challenge.challengeId === challengeRecId) {
        return {
          ...challenge,
          isNeutralized: neutralized,
        };
      }
      return challenge;
    });

    this.certificationDetails.listChallengesAndAnswers = updatedChallenges;
  }
}
