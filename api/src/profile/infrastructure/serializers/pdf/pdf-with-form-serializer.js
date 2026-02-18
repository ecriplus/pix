import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';

import { FONTS, initializeFonts } from '../../../../shared/infrastructure/serializers/pdf/utils.js';
import { getDataBuffer } from '../../../../shared/infrastructure/utils/buffer.js';

export async function serializeStream(stream, entry, creationDate = new Date()) {
  const template = await getDataBuffer(stream);

  return serializePdf(template, entry, creationDate);
}

async function serializePdf(template, entry, creationDate = new Date()) {
  if (Array.isArray(entry)) {
    return serializeArray(template, entry, creationDate);
  } else {
    return serializeObject(template, entry, creationDate);
  }
}

async function serializeArray(template, entries, creationDate) {
  const zip = new JSZip();
  await Promise.all(
    entries.map(async (entry) => {
      const buffer = await serializeObject(template, entry, creationDate);
      zip.file(entry.get('filename') + '.pdf', buffer);
    }),
  );
  return zip.generateAsync({ type: 'nodebuffer' });
}

async function serializeObject(template, entry, creationDate) {
  const pdf = await PDFDocument.load(template);
  const { [FONTS.robotoRegular]: embeddedRobotoFont } = await initializeFonts(pdf, [FONTS.robotoRegular]);

  pdf.setCreationDate(creationDate);
  pdf.setModificationDate(creationDate);

  const form = pdf.getForm();
  for (const [fieldName, value] of entry) {
    if (fieldName === 'filename') continue;
    const field = form.getTextField(fieldName);
    field.setText(value);
    field.updateAppearances(embeddedRobotoFont);
    field.enableReadOnly();
  }
  return Buffer.from(await pdf.save());
}
