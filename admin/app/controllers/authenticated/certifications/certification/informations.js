import Controller from '@ember/controller';
/* eslint-disable ember/no-computed-properties-in-native-classes */
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
/* eslint-enable ember/no-computed-properties-in-native-classes */
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import ENV from 'pix-admin/config/environment';

export default class CertificationInformationsController extends Controller {
  // Domain constants
  MAX_REACHABLE_LEVEL = ENV.APP.MAX_REACHABLE_LEVEL;

  // Properties
  @alias('model.certification') certification;
  @service pixToast;
  @service intl;

  @tracked displayJuryLevelSelect = false;

  @tracked selectedJuryLevel = null;

  @computed('certification.status')
  get isCertificationCancelled() {
    return this.certification.status === 'cancelled';
  }

  get juryLevelOptions() {
    const translatedDefaultJuryOptions = this.certification.complementaryCertificationCourseResultWithExternal
      .get('defaultJuryOptions')
      .map((value) => ({
        value,
        label: this.intl.t(`components.certifications.external-jury-select-options.${value}`),
      }));
    return [
      ...this.certification.complementaryCertificationCourseResultWithExternal.get('allowedExternalLevels'),
      ...translatedDefaultJuryOptions,
    ];
  }

  get shouldDisplayPixScore() {
    return this.certification.version === 2;
  }

  saveAssessmentResult(commentByJury) {
    this.certification.commentByJury = commentByJury;
    return this.certification.save({ adapterOptions: { updateJuryComment: true } });
  }

  async saveCertificationCourse() {
    return await this.certification.save({ adapterOptions: { updateJuryComment: false } });
  }

  @action
  onUpdateScore(code, value) {
    this._updatePropForCompetence(code, value, 'score', 'level');
  }

  @action
  onUpdateLevel(code, value) {
    this._updatePropForCompetence(code, value, 'level', 'score');
  }

  @action
  async onJuryCommentSave(commentByJury) {
    try {
      await this.saveAssessmentResult(commentByJury);
      this.pixToast.sendSuccessNotification({ message: 'Le commentaire du jury a bien été enregistré.' });
      return true;
    } catch {
      this.pixToast.sendErrorNotification({ message: "Le commentaire du jury n'a pas pu être enregistré." });
      return false;
    }
  }

  @action
  selectJuryLevel(value) {
    this.selectedJuryLevel = value;
  }

  @action
  async onEditJuryLevelSave() {
    if (!this.selectedJuryLevel) return;
    await this.certification.save({
      adapterOptions: {
        isJuryLevelEdit: true,
        juryLevel: this.selectedJuryLevel,
        complementaryCertificationCourseId: this.certification.complementaryCertificationCourseResultWithExternal.get(
          'complementaryCertificationCourseId',
        ),
      },
    });
    await this.certification.reload();

    this.displayJuryLevelSelect = false;
  }

  get shouldDisplayJuryLevelEditButton() {
    return this.certification.complementaryCertificationCourseResultWithExternal.get('isExternalResultEditable');
  }

  @action editJury() {
    this.displayJuryLevelSelect = true;
  }

  @action onCancelJuryLevelEditButtonClick() {
    this.displayJuryLevelSelect = false;
  }

  // Private methods
  _copyCompetences() {
    return cloneDeep(this.certification.competencesWithMark);
  }

  _removeFromArray(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

  _updatePropForCompetence(competenceCode, value, propName, linkedPropName) {
    const competences = this._copyCompetences();
    const competence = find(competences, { competence_code: competenceCode });
    if (competence) {
      if (value.trim().length === 0) {
        if (competence[linkedPropName]) {
          competence[propName] = null;
        } else {
          this._removeFromArray(competences, competence);
        }
      } else {
        competence[propName] = parseInt(value);
      }
    } else if (value.trim().length > 0) {
      competences.push({
        competence_code: competenceCode,
        [propName]: parseInt(value),
        area_code: competenceCode.substr(0, 1),
      });
    }
    this.certification.competencesWithMark = competences;
  }
}
