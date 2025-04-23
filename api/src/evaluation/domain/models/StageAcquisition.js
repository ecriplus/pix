class StageAcquisition {
  /**
   *
   * @param {number} id
   * @param {number} stageId
   * @param {number} campaignParticipationId
   */
  constructor({ id, stageId, campaignParticipationId }) {
    this.id = id;
    this.stageId = stageId;
    this.campaignParticipationId = campaignParticipationId;
  }
}

export { StageAcquisition };
