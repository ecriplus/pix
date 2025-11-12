// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed } from '@ember/object';
import { service } from '@ember/service';
import Model, { attr } from '@ember-data/model';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

const PIX_PLUS_INDEX = '';

export default class CertificationDetails extends Model {
  @service intl;

  @attr() competencesWithMark;
  @attr() totalScore;
  @attr() percentageCorrectAnswers;
  @attr() createdAt;
  @attr() userId;
  @attr() status;
  @attr() completedAt;
  @attr() listChallengesAndAnswers;
  version = 2;

  @computed('listChallengesAndAnswers', 'listChallengesAndAnswers.@each.isNeutralized')
  get answers() {
    return this.listChallengesAndAnswers.map((answer, index) => {
      answer.order = index + 1;
      return answer;
    });
  }

  @computed('answers', 'competencesWithMark')
  get competences() {
    const answersByCompetence = groupBy(this.answers, 'competence');

    const competences = this.competencesWithMark.map((competenceWithMark) => {
      return {
        ...competenceWithMark,
        answers: answersByCompetence[competenceWithMark.index],
      };
    });
    if (this.#includePixPlusCompetences(answersByCompetence)) {
      competences.push({
        index: PIX_PLUS_INDEX,
        name: 'Pix +',
        answers: answersByCompetence[PIX_PLUS_INDEX],
      });
    }

    return sortBy(competences, 'index');
  }

  @computed('createdAt')
  get creationDate() {
    return this.intl.formatDate(this.createdAt, { format: 'long' });
  }

  @computed('completedAt')
  get completionDate() {
    return this.intl.formatDate(this.completedAt, { format: 'long' });
  }

  #includePixPlusCompetences(answersByCompetence) {
    return answersByCompetence[PIX_PLUS_INDEX];
  }
}
