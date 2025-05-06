import Service, { service } from '@ember/service';

export default class PassageEvents extends Service {
  @service store;

  passageId = null;
  sequenceNumber = 1;

  initialize({ passageId }) {
    this.passageId = Number(passageId);
  }

  async record({ type, data }) {
    this.sequenceNumber++;

    const passageEventsCollection = this.store.createRecord('passage-events-collection');
    passageEventsCollection.events = [
      {
        type,
        passageId: this.passageId,
        sequenceNumber: this.sequenceNumber,
        occurredAt: new Date().getTime(),
        ...data,
      },
    ];
    passageEventsCollection.save();
  }
}
