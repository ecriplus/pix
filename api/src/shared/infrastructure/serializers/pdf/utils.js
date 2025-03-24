import { readFile } from 'node:fs/promises';
import * as url from 'node:url';

import pdfLibFontKit from '@pdf-lib/fontkit';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const FONTS = {
  robotoCondensedBold: 'robotoCondensedBold',
  robotoCondensedLight: 'robotoCondensedLight',
  robotoCondensedRegular: 'robotoCondensedRegular',
  robotoRegular: 'robotoRegular',
};

const FONT_FILES_BY_FONT_KEY = {
  [FONTS.robotoCondensedBold]: 'RobotoCondensed-Bold.ttf',
  [FONTS.robotoCondensedLight]: 'RobotoCondensed-Light.ttf',
  [FONTS.robotoCondensedRegular]: 'RobotoCondensed-Regular.ttf',
  [FONTS.robotoRegular]: 'Roboto-Regular.ttf',
};

/**
 * @param pdfDocument {PDFDocument}
 * @param fontsKeysToEmbed {Array<string>}
 * @returns {Promise<Object<key: string, value: StandardFonts>>}
 */
export async function initializeFonts(pdfDocument, fontsKeysToEmbed) {
  pdfDocument.registerFontkit(pdfLibFontKit);
  const finalFontKeysToEmbed = fontsKeysToEmbed.length > 0 ? fontsKeysToEmbed : Object.values(FONTS);
  const embeddedFonts = {};
  for (const fontKey of finalFontKeysToEmbed) {
    const fontFilename = FONT_FILES_BY_FONT_KEY[fontKey];
    const fontFile = await readFile(`${__dirname}/fonts/${fontFilename}`);
    embeddedFonts[fontKey] = await pdfDocument.embedFont(fontFile, { subset: true, customName: fontFilename });
  }
  return embeddedFonts;
}
