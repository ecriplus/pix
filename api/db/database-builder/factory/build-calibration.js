import { databaseBuffer } from '../database-buffer.js';

const buildCalibration = function ({
  id = databaseBuffer.getNextId(),
  calibration_date = new Date(),
  scope = 'COEUR',
  status = 'TO_VALIDATE',
} = {}) {
  const values = {
    id,
    calibration_date,
    scope,
    status,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'certification-data-calibrations',
    values,
  });
};

export { buildCalibration };
