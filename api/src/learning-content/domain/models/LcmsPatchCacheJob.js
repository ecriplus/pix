export class LcmsPatchCacheJob {
  constructor({ userId, recordId, updatedRecord, modelName }) {
    this.userId = userId;
    this.recordId = recordId;
    this.updatedRecord = updatedRecord;
    this.modelName = modelName;
  }
}
