import { databaseBuffer } from '../../database-buffer.js';

export function buildFramework({ id = 'frameworkPix', name = 'Pix' } = {}) {
  const values = {
    id,
    name,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'learningcontent.frameworks',
    values,
  });
}
