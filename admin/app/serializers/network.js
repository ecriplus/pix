import ApplicationSerializer from './application';

export default class NetworkSerializer extends ApplicationSerializer {
  serialize(snapshot, options) {
    const json = super.serialize(snapshot, options);

    if (!snapshot.record.isNew) {
      json.data.attributes = {
        name: json.data.attributes.name,
      };
    }

    return json;
  }
}
