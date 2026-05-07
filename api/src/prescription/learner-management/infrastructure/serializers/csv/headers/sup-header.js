import _ from 'lodash';

import { CsvColumn } from '../../../../../../shared/infrastructure/serializers/csv/csv-column.js';

const I18N_PREFIX = 'csv-template.sup-organization-learners';

class SupHeader {
  constructor(i18n) {
    this.translate = i18n.__;
    this.columns = this.setColumns();
  }

  setColumns() {
    return [
      { property: 'firstName', isRequired: true, checkEncoding: true },
      { property: 'middleName' },
      { property: 'thirdName' },
      { property: 'lastName', isRequired: true },
      { property: 'preferredLastName' },
      { property: 'birthdate', isRequired: true, isDate: true },
      { property: 'email' },
      { property: 'studentNumber', isRequired: true, checkEncoding: true },
      { property: 'department' },
      { property: 'educationalTeam' },
      { property: 'group' },
      { property: 'diploma' },
      { property: 'studyScheme' },
    ].map(
      ({ property, ...options }) =>
        new CsvColumn({ property, name: this.translate(`${I18N_PREFIX}.${_.kebabCase(property)}`), ...options }),
    );
  }
}

export { SupHeader };
