class ObjectConfiguration {
  constructor({ name, refersToAnArray, fields }) {
    this.name = name;
    this.refersToAnArray = refersToAnArray;
    this.fields = fields;
  }

  buildRequirementFromFormValues(comparison, fields) {
    const data = fields.reduce((data, field) => {
      if (field.comparison && (field.value || field.value === false)) {
        data[field.name] = {
          data: {
            comparison: field.comparison,
            value: ['one-of', 'all'].includes(field.comparison) ? field.value.split(',') : field.value,
          },
        };
      }
      return data;
    }, {});
    return {
      requirement_type: this.name,
      comparison,
      data,
    };
  }
}

class FieldConfiguration {
  constructor({ name, type, refersToAnArray, allowedValues = [] }) {
    this.name = name;
    this.type = type;
    this.refersToAnArray = refersToAnArray;
    this.allowedValues = allowedValues;
  }

  static get TYPES() {
    return {
      BOOLEAN: 'BOOLEAN',
      STRING: 'STRING',
      NUMBER: 'NUMBER',
    };
  }
}

const organizationField_isManagingStudents = new FieldConfiguration({
  name: 'isManagingStudents',
  type: FieldConfiguration.TYPES.BOOLEAN,
  refersToAnArray: false,
});
const organizationField_tags = new FieldConfiguration({
  name: 'tags',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: true,
});
const organizationField_type = new FieldConfiguration({
  name: 'type',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: false,
  allowedValues: ['PRO', 'SCO', 'SUP'],
});
const organizationConfiguration = new ObjectConfiguration({
  name: 'organization',
  refersToAnArray: false,
  fields: [organizationField_isManagingStudents, organizationField_tags, organizationField_type],
});

const organizationLearnerField_MEFCode = new FieldConfiguration({
  name: 'MEFCode',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: false,
});
const organizationLearnerConfiguration = new ObjectConfiguration({
  name: 'organizationLearner',
  refersToAnArray: false,
  fields: [organizationLearnerField_MEFCode],
});

const campaignParticipationsField_targetProfileId = new FieldConfiguration({
  name: 'targetProfileId',
  type: FieldConfiguration.TYPES.NUMBER,
  refersToAnArray: false,
});
const campaignParticipationsField_status = new FieldConfiguration({
  name: 'status',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: false,
  allowedValues: ['STARTED', 'TO_SHARE', 'SHARED'],
});
const campaignParticipationsConfiguration = new ObjectConfiguration({
  name: 'campaignParticipations',
  refersToAnArray: true,
  fields: [campaignParticipationsField_targetProfileId, campaignParticipationsField_status],
});

const objectConfigurations = {
  [organizationConfiguration.name]: organizationConfiguration,
  [organizationLearnerConfiguration.name]: organizationLearnerConfiguration,
  [campaignParticipationsConfiguration.name]: campaignParticipationsConfiguration,
};

export { objectConfigurations };
