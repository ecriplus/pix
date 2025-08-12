import Service, { service } from '@ember/service';
import ENV from 'mon-pix/config/environment';

export default class PassageEvents extends Service {
  @service store;
  @service requestManager;
  @service modulixPreviewMode;

  passageId = null;
  sequenceNumber = 1;

  initialize({ passageId }) {
    this.passageId = Number(passageId);
    this.sequenceNumber = 1;
  }

  async record({ type, data }) {
    this.sequenceNumber++;

    if (this.modulixPreviewMode.isEnabled) {
      return;
    }

    const events = [
      {
        type,
        'passage-id': this.passageId,
        'sequence-number': this.sequenceNumber,
        'occurred-at': new Date().getTime(),
        ...data,
      },
    ];

    return this.requestManager.request({
      url: `${ENV.APP.API_HOST}/api/passage-events`,
      method: 'POST',
      body: JSON.stringify({ data: { attributes: { events } } }),
    });
  }
}
