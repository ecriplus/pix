import { mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { buildStaticCatalog, defaultSettings, getI18n } from '../../../../../src/shared/infrastructure/i18n/i18n.js';
import { expect } from '../../../../test-helper.js';

async function createTranslationDir(dirPath, files) {
  await mkdir(dirPath, { recursive: true });
  for (const [filename, content] of Object.entries(files)) {
    await writeFile(path.join(dirPath, filename), JSON.stringify(content), 'utf-8');
  }
  return dirPath;
}

describe('Unit | Shared | Infrastucture | i18n', function () {
  describe('getI18n', function () {
    it('returns an instance of i18n with default locale', function () {
      const i18n = getI18n();
      expect(i18n.getLocale()).to.equal('fr');
    });

    context('when the locale is supported and is a base locale', function () {
      it('returns an instance of i18n with the specified locale', function () {
        const locale = 'es';
        const i18n = getI18n(locale);
        expect(i18n.getLocale()).to.equal('es');
      });
    });

    context('when the locale is supported and is a BCP 47 format locale, not a base locale', function () {
      it('returns an instance of i18n with the specified locale', function () {
        // staticCatalog option is used to test the es-419 locale without having a .json file
        const settings = {
          ...defaultSettings,
          staticCatalog: {
            en: {},
            fr: {},
            es: {},
            'es-419': {},
            nl: {},
          },
        };
        const locale = 'es-419';
        const i18n = getI18n(locale, settings);
        expect(i18n.getLocale()).to.equal('es-419');
      });
    });

    context('when the locale is supported but has no translation file', function () {
      it('returns the corresponding fallback locale', function () {
        const locale = 'nl-BE';
        const i18n = getI18n(locale);
        expect(i18n.getLocale()).to.equal('nl');
      });
    });

    context('when the locale is not supported', function () {
      it('returns the default locale instance of i18n', function () {
        const locale = 'foo';
        const i18n = getI18n(locale);
        expect(i18n.getLocale()).to.equal('fr');
      });
    });

    context('when the i18n setLocale is called on an i18n instance', function () {
      it('does not change the instance locale', function () {
        const i18n1 = getI18n('fr');
        i18n1.setLocale('en');
        expect(i18n1.getLocale()).to.equal('fr');
      });
    });

    describe('getI18n().__', function () {
      it('interpolates parameters with single mustache', async function () {
        // when
        const result = getI18n().__('Hello {name}', { name: 'Bob' });

        // then
        expect(result).to.equal('Hello Bob');
      });

      it('interpolates parameter with single mustach when first argument is an object with explicit locale', async function () {
        // when
        const result = getI18n().__({ phrase: 'Hello {name}', locale: 'fr' }, { name: 'Bob' });

        // then
        expect(result).to.equal('Hello Bob');
      });
    });
  });

  describe('buildStaticCatalog', function () {
    it('returns translations from the base folder when no override folders are given', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-base-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { greeting: 'Bonjour', farewell: 'Au revoir' },
        'en.json': { greeting: 'Hello', farewell: 'Goodbye' },
      });

      // when
      const catalog = await buildStaticCatalog(baseDir, []);

      // then
      expect(catalog).to.deep.equal({
        fr: { greeting: 'Bonjour', farewell: 'Au revoir' },
        en: { greeting: 'Hello', farewell: 'Goodbye' },
      });

      await rm(baseDir, { recursive: true, force: true });
    });

    it('merges override translations on top of base translations', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-base-${Date.now()}`);
      const overrideDir = path.join(os.tmpdir(), `pix-i18n-override-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { greeting: 'Bonjour', farewell: 'Au revoir' },
      });
      await createTranslationDir(overrideDir, {
        'fr.json': { greeting: 'Salut' },
      });

      // when
      const catalog = await buildStaticCatalog(baseDir, [overrideDir]);

      // then
      expect(catalog.fr).to.deep.equal({ greeting: 'Salut', farewell: 'Au revoir' });

      await rm(baseDir, { recursive: true, force: true });
      await rm(overrideDir, { recursive: true, force: true });
    });

    it('applies multiple override folders in order, with later folders taking precedence', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-base-${Date.now()}`);
      const override1Dir = path.join(os.tmpdir(), `pix-i18n-override1-${Date.now()}`);
      const override2Dir = path.join(os.tmpdir(), `pix-i18n-override2-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { greeting: 'Bonjour', farewell: 'Au revoir', extra: 'Extra' },
      });
      await createTranslationDir(override1Dir, {
        'fr.json': { greeting: 'Salut', farewell: 'Ciao' },
      });
      await createTranslationDir(override2Dir, {
        'fr.json': { greeting: 'Yo' },
      });

      // when
      const catalog = await buildStaticCatalog(baseDir, [override1Dir, override2Dir]);

      // then
      expect(catalog.fr).to.deep.equal({ greeting: 'Yo', farewell: 'Ciao', extra: 'Extra' });

      await rm(baseDir, { recursive: true, force: true });
      await rm(override1Dir, { recursive: true, force: true });
      await rm(override2Dir, { recursive: true, force: true });
    });

    it('ignores override folders that do not have a file for a given locale', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-base-${Date.now()}`);
      const overrideDir = path.join(os.tmpdir(), `pix-i18n-override-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { greeting: 'Bonjour' },
        'en.json': { greeting: 'Hello' },
      });
      await createTranslationDir(overrideDir, {
        'fr.json': { greeting: 'Salut' },
        // no en.json in override
      });

      // when
      const catalog = await buildStaticCatalog(baseDir, [overrideDir]);

      // then
      expect(catalog.fr).to.deep.equal({ greeting: 'Salut' });
      expect(catalog.en).to.deep.equal({ greeting: 'Hello' });

      await rm(baseDir, { recursive: true, force: true });
      await rm(overrideDir, { recursive: true, force: true });
    });

    it('performs a deep merge of nested translation objects', async function () {
      // given
      const baseDir = path.join(os.tmpdir(), `pix-i18n-base-${Date.now()}`);
      const overrideDir = path.join(os.tmpdir(), `pix-i18n-override-${Date.now()}`);
      await createTranslationDir(baseDir, {
        'fr.json': { emails: { welcome: { subject: 'Bienvenue', body: 'Corps du message' } } },
      });
      await createTranslationDir(overrideDir, {
        'fr.json': { emails: { welcome: { subject: 'Nouveau sujet' } } },
      });

      // when
      const catalog = await buildStaticCatalog(baseDir, [overrideDir]);

      // then
      expect(catalog.fr).to.deep.equal({ emails: { welcome: { subject: 'Nouveau sujet', body: 'Corps du message' } } });

      await rm(baseDir, { recursive: true, force: true });
      await rm(overrideDir, { recursive: true, force: true });
    });
  });
});
