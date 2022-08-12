// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../../domain/models/Stage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(stage = {}) {
    return new Serializer('stage', {
      ref: 'id',
      attributes: ['message', 'threshold', 'title', 'prescriberTitle', 'prescriberDescription'],
    }).serialize(stage);
  },
  deserialize(json: $TSFixMe) {
    return new Stage({
      title: json.data.attributes.title,
      message: json.data.attributes.message,
      threshold: json.data.attributes.threshold,
      targetProfileId: json.data.relationships?.['target-profile']?.data.id,
      prescriberTitle: json.data.attributes['prescriber-title'],
      prescriberDescription: json.data.attributes['prescriber-description'],
    });
  },
};
