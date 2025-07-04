import { datamartBuffer } from '../datamart-buffer.js';

const buildCalibration = function ({
  id = datamartBuffer.getNextId(),
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

  return datamartBuffer.pushInsertable({
    tableName: 'data_calibrations',
    values,
  });
};

export { buildCalibration };
