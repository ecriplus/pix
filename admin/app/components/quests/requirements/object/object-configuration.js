class ObjectConfiguration {
  constructor({ name, refersToAnArray, fieldConfigurations, mergeFields = false }) {
    this.name = name;
    this.refersToAnArray = refersToAnArray;
    this.fieldConfigurations = fieldConfigurations;
    this.mergeFields = mergeFields;
  }

  buildRequirementFromFormValues(formComparison, formFields) {
    const data = {};
    for (const fieldConfiguration of this.fieldConfigurations) {
      const formField = formFields.find((formField) => formField.name === fieldConfiguration.name);

      let trimmedFormFieldValue =
        formField.data && !Array.isArray(formField.data) ? formField.data.toString().trim() : formField.data;

      if (fieldConfiguration.parseToObject && !Array.isArray(formField.data)) {
        trimmedFormFieldValue = JSON.parse(trimmedFormFieldValue);
      }
      const isFormFieldValid = formField.comparison && trimmedFormFieldValue;
      if (!isFormFieldValid) {
        continue;
      }

      const value =
        fieldConfiguration.parseToObject || Array.isArray(trimmedFormFieldValue)
          ? trimmedFormFieldValue
          : ['one-of', 'all'].includes(formField.comparison)
            ? trimmedFormFieldValue
                .split(',')
                .map((value) => castFromStringToType(value.trim(), fieldConfiguration.type))
            : castFromStringToType(trimmedFormFieldValue, fieldConfiguration.type);

      data[formField.name] = {
        comparison: formField.comparison,
        data: value,
      };
    }
    return {
      requirement_type: this.name,
      comparison: formComparison,
      data,
    };
  }

  formatRequirement(requirement) {
    if (this.mergeFields) {
      const mergedFields = {};
      for (const [key, object] of Object.entries(requirement.data)) {
        mergedFields[key] = object.data;
      }

      return Object.assign({}, requirement, { data: mergedFields });
    } else {
      return requirement;
    }
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
  constructor({ name, type, refersToAnArray, hasSingleChoice = false, parseToObject = false, allowedValues = [] }) {
    this.name = name;
    this.type = type;
    this.refersToAnArray = refersToAnArray;
    this.parseToObject = parseToObject;
    this.allowedValues = allowedValues;
    this.hasSingleChoice = hasSingleChoice;
  }

  static get TYPES() {
    return {
      BOOLEAN: 'BOOLEAN',
      STRING: 'STRING',
      NUMBER: 'NUMBER',
    };
  }
}

// ORGANIZATION
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

// ORGANIZATION LEARNER
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

// CAMPAIGN PARTICIPATIONS
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

// CAPPED TUBES
const cappedTubeConfiguration_cappedTubes = new FieldConfiguration({
  name: 'cappedTubes',
  type: FieldConfiguration.TYPES.STRING,
  hasSingleChoice: true,
  parseToObject: true,
  refersToAnArray: true,
});
const cappedTubeConfiguration_threshold = new FieldConfiguration({
  name: 'threshold',
  type: FieldConfiguration.TYPES.NUMBER,
  hasSingleChoice: true,
  refersToAnArray: false,
});

const cappedTubeConfiguration = new ObjectConfiguration({
  name: 'cappedTubes',
  refersToAnArray: false,
  mergeFields: true,
  fieldConfigurations: [cappedTubeConfiguration_cappedTubes, cappedTubeConfiguration_threshold],
});

const objectConfigurations = {
  [organizationConfiguration.name]: organizationConfiguration,
  [organizationLearnerConfiguration.name]: organizationLearnerConfiguration,
  [campaignParticipationsConfiguration.name]: campaignParticipationsConfiguration,
  [cappedTubeConfiguration.name]: cappedTubeConfiguration,
};

export { objectConfigurations };
