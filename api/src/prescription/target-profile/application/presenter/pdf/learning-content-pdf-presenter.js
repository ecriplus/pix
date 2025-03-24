import 'dayjs/locale/fr.js';

import { PDFDocument } from 'pdf-lib';

import * as coverPageBuilder from './builder/cover-page-builder.js';
import * as learningContentBuilder from './builder/learning-content-builder.js';
import { FontManager } from './manager/font-manager.js';
import * as TemplatePageManager from './manager/template-page-manager.js';

const present = async function (learningContent, title, language) {
  const pdfDocument = await _initializeNewPDFDocument();
  coverPageBuilder.build(pdfDocument, title, language);
  const pdfBytes = await learningContentBuilder.build(pdfDocument, learningContent, language).save();
  return Buffer.from(pdfBytes);
};

export { present };

/**
 * @returns {Promise<PDFDocument>}
 * @private
 */
async function _initializeNewPDFDocument() {
  const pdfDocument = await PDFDocument.create();
  await FontManager.initializeFonts(pdfDocument);
  await TemplatePageManager.initializeTemplatesPages(pdfDocument);
  return pdfDocument;
}
