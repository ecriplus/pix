import { PDFDocument } from 'pdf-lib';
import yazl from 'yazl';

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
  const zipfile = new yazl.ZipFile();

  for (const entry of entries) {
    const buffer = await serializeObject(template, entry, creationDate);
    zipfile.addBuffer(buffer, `${entry.get('filename')}.pdf`);
  }

  zipfile.end();

  return zipfile.outputStream;
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
    field.enableReadOnly();
  }

  form.updateFieldAppearances(embeddedRobotoFont);

  const bytes = await pdf.save({
    useObjectStreams: false,
  });

  return Buffer.from(bytes);
}
