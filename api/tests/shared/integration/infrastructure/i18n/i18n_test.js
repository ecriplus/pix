import { mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { I18n } from 'i18n';

import { buildStaticCatalog, defaultSettings } from '../../../../../src/shared/infrastructure/i18n/i18n.js';
import { expect } from '../../../../test-helper.js';

async function createTranslationDir(dirPath, files) {
  await mkdir(dirPath, { recursive: true });
  for (const [filename, content] of Object.entries(files)) {
    await writeFile(path.join(dirPath, filename), JSON.stringify(content), 'utf-8');
  }
  return dirPath;
}

function i18nFor(locale, staticCatalog) {
  const i18n = new I18n({ ...defaultSettings, staticCatalog });
  i18n.setLocale(locale);
  return i18n;
}

describe('Integration | Shared | Infrastructure | i18n', function () {
  describe('translation overrides via buildStaticCatalog', function () {
    it('produces a catalog that overrides base translations while preserving unoverridden keys', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-integ-base-${Date.now()}`);
      const overrideDir = path.join(os.tmpdir(), `pix-i18n-integ-override-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { 'test-key': 'Valeur originale', 'unchanged-key': 'Valeur inchangée' },
      });
      await createTranslationDir(overrideDir, {
        'fr.json': { 'test-key': 'Valeur surchargée' },
      });

      // when
      const staticCatalog = await buildStaticCatalog(baseDir, [overrideDir]);
      const i18n = i18nFor('fr', staticCatalog);

      // then
      expect(i18n.__('test-key')).to.equal('Valeur surchargée');
      expect(i18n.__('unchanged-key')).to.equal('Valeur inchangée');

      await rm(baseDir, { recursive: true, force: true });
      await rm(overrideDir, { recursive: true, force: true });
    });

    it('produces a catalog with overridden translations for multiple locales', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-integ-base-${Date.now()}`);
      const overrideDir = path.join(os.tmpdir(), `pix-i18n-integ-override-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { greeting: 'Bonjour' },
        'en.json': { greeting: 'Hello' },
      });
      await createTranslationDir(overrideDir, {
        'fr.json': { greeting: 'Salut' },
        'en.json': { greeting: 'Hi' },
      });

      // when
      const staticCatalog = await buildStaticCatalog(baseDir, [overrideDir]);

      // then
      expect(i18nFor('fr', staticCatalog).__('greeting')).to.equal('Salut');
      expect(i18nFor('en', staticCatalog).__('greeting')).to.equal('Hi');

      await rm(baseDir, { recursive: true, force: true });
      await rm(overrideDir, { recursive: true, force: true });
    });

    it('applies two override folders in order, the last one taking final precedence', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-integ-base-${Date.now()}`);
      const override1Dir = path.join(os.tmpdir(), `pix-i18n-integ-override1-${Date.now()}`);
      const override2Dir = path.join(os.tmpdir(), `pix-i18n-integ-override2-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { greeting: 'Bonjour', farewell: 'Au revoir' },
      });
      await createTranslationDir(override1Dir, {
        'fr.json': { greeting: 'Salut', farewell: 'Ciao' },
      });
      await createTranslationDir(override2Dir, {
        'fr.json': { greeting: 'Yo' },
      });

      // when
      const staticCatalog = await buildStaticCatalog(baseDir, [override1Dir, override2Dir]);
      const i18n = i18nFor('fr', staticCatalog);

      // then
      expect(i18n.__('greeting')).to.equal('Yo');
      expect(i18n.__('farewell')).to.equal('Ciao');

      await rm(baseDir, { recursive: true, force: true });
      await rm(override1Dir, { recursive: true, force: true });
      await rm(override2Dir, { recursive: true, force: true });
    });
  });
});
