import { databaseBuffer } from '../../database-buffer.js';

export function buildTutorial({
  id = 'tutorialIdA',
  duration = 'duration Tutoriel A',
  format = 'format Tutoriel A',
  title = 'title Tutoriel A',
  source = 'source Tutoriel A',
  link = 'link Tutoriel A',
  locale = 'fr',
} = {}) {
  const values = {
    id,
    duration,
    format,
    title,
    source,
    link,
    locale,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'learningcontent.tutorials',
    values,
  });
}
