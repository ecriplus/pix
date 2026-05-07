import _ from 'lodash';

import { CsvColumn } from '../../../../../../shared/infrastructure/serializers/csv/csv-column.js';

const I18N_PREFIX = 'csv-template.fregata-organization-learners';

class FregataHeader {
  constructor(i18n) {
    this.translate = i18n.__;
    this.columns = this.#setColumns();
  }

  #setColumns() {
    return [
      { property: 'nationalIdentifier', isRequired: true },
      { property: 'firstName', isRequired: true, checkEncoding: true },
      { property: 'middleName' },
      { property: 'thirdName' },
      { property: 'lastName', isRequired: true },
      { property: 'preferredLastName' },
      { property: 'sex', isRequired: true },
      { property: 'birthdate', isRequired: true, isDate: true },
      { property: 'birthCityCode' },
      { property: 'birthCity' },
      { property: 'birthProvinceCode', isRequired: true },
      { property: 'birthCountryCode', isRequired: true },
      { property: 'status', isRequired: true },
      { property: 'MEFCode', isRequired: true },
      { property: 'division', isRequired: true },
    ].map(
      ({ property, ...options }) =>
        new CsvColumn({ property, name: this.translate(`${I18N_PREFIX}.${_.kebabCase(property)}`), ...options }),
    );
  }
}

export { FregataHeader };
