const identifierNaming = require('./identifier-naming');
const tableNameCasing = require('./table-name-casing');
const columnNameCasing = require('./column-name-casing');
const foreignKeysToId = require('./foreign-key-to-id');
const defaultVarcharLength = require('./default-varchar-length');
const missingForeignKey = require('./missing-foreign-key');

module.exports = {
  identifierNaming,
  tableNameCasing,
  columnNameCasing,
  foreignKeysToId,
  defaultVarcharLength,
  missingForeignKey,
};
