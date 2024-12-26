import _ from 'lodash';

import * as csvSerializer from '../../../../../shared/infrastructure/serializers/csv/csv-serializer.js';

class CampaignAssessmentExport {
  constructor({
    outputStream,
    organization,
    targetProfile,
    learningContent,
    stageCollection,
    campaign,
    competences,
    translate,
    additionalHeaders = [],
  }) {
    this.stream = outputStream;
    this.organization = organization;
    this.campaign = campaign;
    this.targetProfile = targetProfile;
    this.learningContent = learningContent;
    this.stageCollection = stageCollection;
    this.idPixLabel = campaign.idPixLabel;
    this.competences = competences;
    this.translate = translate;
    this.additionalHeaders = additionalHeaders;
  }

  export() {
    this.stream.write(this.#buildHeader());
  }

  #buildHeader() {
    const forSupStudents = this.organization.isSup && this.organization.isManagingStudents;
    const displayDivision = this.organization.isSco && this.organization.isManagingStudents;

    const extraHeaders = this.additionalHeaders.map((header) => header.columnName);

    const headers = [
      this.translate('campaign-export.common.organization-name'),
      this.translate('campaign-export.common.campaign-id'),
      this.translate('campaign-export.common.campaign-code'),
      this.translate('campaign-export.common.campaign-name'),
      this.translate('campaign-export.assessment.target-profile-name'),
      this.translate('campaign-export.common.participant-lastname'),
      this.translate('campaign-export.common.participant-firstname'),
      ...extraHeaders,
      ...(displayDivision ? [this.translate('campaign-export.common.participant-division')] : []),
      ...(forSupStudents ? [this.translate('campaign-export.common.participant-group')] : []),
      ...(forSupStudents ? [this.translate('campaign-export.common.participant-student-number')] : []),
      ...(this.campaign.idPixLabel ? [this.campaign.idPixLabel] : []),

      this.translate('campaign-export.assessment.progress'),
      this.translate('campaign-export.assessment.started-on'),
      this.translate('campaign-export.assessment.is-shared'),
      this.translate('campaign-export.assessment.shared-on'),

      ...(this.stageCollection.hasStage
        ? [this.translate('campaign-export.assessment.success-rate', { value: this.stageCollection.totalStages - 1 })]
        : []),

      ..._.flatMap(this.targetProfile.badges, (badge) => [
        this.translate('campaign-export.assessment.thematic-result-name', { name: badge.title }),
      ]),

      this.translate('campaign-export.assessment.mastery-percentage-target-profile'),

      ...this.#competenceColumnHeaders(),
      ...this.#areaColumnHeaders(),

      ...(this.organization.showSkills ? this.learningContent.skillNames : []),
    ];

    // WHY: add \uFEFF the UTF-8 BOM at the start of the text, see:
    // - https://en.wikipedia.org/wiki/Byte_order_mark
    // - https://stackoverflow.com/a/38192870
    return '\uFEFF' + csvSerializer.serializeLine(_.compact(headers));
  }

  async _getUsersPlacementProfiles(campaignParticipationResultDataChunk, placementProfileService) {
    const userIdsAndDates = campaignParticipationResultDataChunk.map(({ userId, sharedAt }) => {
      return { userId, sharedAt };
    });

    const placementProfiles = await placementProfileService.getPlacementProfilesWithSnapshotting({
      userIdsAndDates,
      competences: this.competences,
      allowExcessPixAndLevels: false,
    });

    return placementProfiles;
  }

  #competenceColumnHeaders() {
    return _.flatMap(this.learningContent.competences, (competence) => [
      this.translate('campaign-export.assessment.skill.mastery-percentage', { name: competence.name }),
      this.translate('campaign-export.assessment.skill.total-items', { name: competence.name }),
      this.translate('campaign-export.assessment.skill.items-successfully-completed', { name: competence.name }),
    ]);
  }

  #areaColumnHeaders() {
    return _.flatMap(this.learningContent.areas, (area) => [
      this.translate('campaign-export.assessment.competence-area.mastery-percentage', { name: area.title }),
      this.translate('campaign-export.assessment.competence-area.total-items', { name: area.title }),
      this.translate('campaign-export.assessment.competence-area.items-successfully-completed', { name: area.title }),
    ]);
  }
}

export { CampaignAssessmentExport };
