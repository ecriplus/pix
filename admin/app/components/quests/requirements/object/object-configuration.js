class ObjectConfiguration {
  constructor({ name, refersToAnArray, fieldConfigurations }) {
    this.name = name;
    this.refersToAnArray = refersToAnArray;
    this.fieldConfigurations = fieldConfigurations;
  }

  buildRequirementFromFormValues(formComparison, formFields) {
    const data = {};
    for (const fieldConfiguration of this.fieldConfigurations) {
      const formField = formFields.find((formField) => formField.name === fieldConfiguration.name);
      const trimmedFormFieldValue = formField.value ? formField.value.toString().trim() : formField.value;
      const isFormFieldValid = formField.comparison && trimmedFormFieldValue;
      if (!isFormFieldValid) {
        continue;
      }
      data[formField.name] = {
        data: {
          comparison: formField.comparison,
          value: ['one-of', 'all'].includes(formField.comparison)
            ? trimmedFormFieldValue
                .split(',')
                .map((value) => castFromStringToType(value.trim(), fieldConfiguration.type))
            : castFromStringToType(trimmedFormFieldValue, fieldConfiguration.type),
        },
      };
    }
    return {
      requirement_type: this.name,
      comparison: formComparison,
      data,
    };
  }
}

function castFromStringToType(strValue, type) {
  if (type === FieldConfiguration.TYPES.BOOLEAN) {
    return strValue.toLowerCase() === 'true';
  }
  if (type === FieldConfiguration.TYPES.NUMBER) {
    return parseInt(strValue);
  }
  return strValue;
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

const organizationConfigField_isManagingStudents = new FieldConfiguration({
  name: 'isManagingStudents',
  type: FieldConfiguration.TYPES.BOOLEAN,
  refersToAnArray: false,
  allowedValues: ['true', 'false'],
});
const organizationConfigField_tags = new FieldConfiguration({
  name: 'tags',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: true,
});
const organizationConfigField_type = new FieldConfiguration({
  name: 'type',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: false,
  allowedValues: ['PRO', 'SCO', 'SUP'],
});
const organizationConfiguration = new ObjectConfiguration({
  name: 'organization',
  refersToAnArray: false,
  fieldConfigurations: [
    organizationConfigField_isManagingStudents,
    organizationConfigField_tags,
    organizationConfigField_type,
  ],
});

const organizationLearnerConfigField_MEFCode = new FieldConfiguration({
  name: 'MEFCode',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: false,
});
const organizationLearnerConfiguration = new ObjectConfiguration({
  name: 'organizationLearner',
  refersToAnArray: false,
  fieldConfigurations: [organizationLearnerConfigField_MEFCode],
});

const campaignParticipationsConfigField_targetProfileId = new FieldConfiguration({
  name: 'targetProfileId',
  type: FieldConfiguration.TYPES.NUMBER,
  refersToAnArray: false,
});
const campaignParticipationsConfigField_status = new FieldConfiguration({
  name: 'status',
  type: FieldConfiguration.TYPES.STRING,
  refersToAnArray: false,
  allowedValues: ['STARTED', 'TO_SHARE', 'SHARED'],
});
const campaignParticipationsConfiguration = new ObjectConfiguration({
  name: 'campaignParticipations',
  refersToAnArray: true,
  fieldConfigurations: [campaignParticipationsConfigField_targetProfileId, campaignParticipationsConfigField_status],
});

const objectConfigurations = {
  [organizationConfiguration.name]: organizationConfiguration,
  [organizationLearnerConfiguration.name]: organizationLearnerConfiguration,
  [campaignParticipationsConfiguration.name]: campaignParticipationsConfiguration,
};

export { objectConfigurations };
