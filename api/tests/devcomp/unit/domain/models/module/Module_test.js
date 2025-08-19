import { Module } from '../../../../../../src/devcomp/domain/models/module/Module.js';
import { DomainError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | Module | Module', function () {
  describe('#constructor', function () {
    it('should create a module and keep attributes', function () {
      // given
      const id = 1;
      const slug = 'les-adresses-email';
      const title = 'Les adresses email';
      const isBeta = false;
      const sections = [Symbol('text')];
      const details = Symbol('details');
      const version = Symbol('version');

      // when
      const module = new Module({ id, slug, title, isBeta, sections, details, version });

      // then
      expect(module.id).to.equal(id);
      expect(module.slug).to.equal(slug);
      expect(module.title).to.equal(title);
      expect(module.isBeta).to.equal(isBeta);
      expect(module.sections).to.have.lengthOf(sections.length);
      expect(module.details).to.deep.equal(details);
      expect(module.version).to.deep.equal(version);
    });

    describe('if a module does not have an id', function () {
      it('should throw an error', function () {
        // when
        const error = catchErrSync(() => new Module({}))();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('The id is required for a module');
      });
    });

    describe('if a module does not have a slug', function () {
      it('should throw an error', function () {
        // when
        const error = catchErrSync(() => new Module({ id: 1 }))();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('The slug is required for a module');
      });
    });

    describe('if a module does not have a title', function () {
      it('should throw an error', function () {
        // when
        const error = catchErrSync(() => new Module({ id: 1, slug: 'my-slug' }))();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('The title is required for a module');
      });
    });

    describe('if a module does not have isBeta value', function () {
      it('should throw an error', function () {
        // when
        const error = catchErrSync(
          () =>
            new Module({
              id: 'id_module_1',
              slug: 'bien-ecrire-son-adresse-mail',
              title: 'Bien écrire son adresse mail',
            }),
        )();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('isBeta value is required for a module');
      });
    });

    describe('if a module does not have sections', function () {
      it('should throw an error', function () {
        // when
        const error = catchErrSync(
          () =>
            new Module({
              id: 'id_module_1',
              slug: 'bien-ecrire-son-adresse-mail',
              title: 'Bien écrire son adresse mail',
              isBeta: true,
            }),
        )();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('A list of sections is required for a module');
      });
    });

    describe('if a module has sections with the wrong type', function () {
      it('should throw an error', function () {
        // when
        const error = catchErrSync(
          () =>
            new Module({
              id: 'id_module_1',
              slug: 'bien-ecrire-son-adresse-mail',
              title: 'Bien écrire son adresse mail',
              isBeta: true,
              sections: 'elements',
            }),
        )();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal(`A list of sections is required for a module`);
      });
    });

    describe('if a module does not have details', function () {
      it('should throw an error', function () {
        // when
        const error = catchErrSync(
          () =>
            new Module({
              id: 'id_module_1',
              slug: 'bien-ecrire-son-adresse-mail',
              title: 'Bien écrire son adresse mail',
              isBeta: true,
              sections: [],
            }),
        )();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('The details are required for a module');
      });
    });
  });

  describe('#setRedirectionUrl', function () {
    let module;

    beforeEach(function () {
      const id = 1;
      const slug = 'les-adresses-email';
      const title = 'Les adresses email';
      const isBeta = false;
      const sections = [Symbol('text')];
      const details = Symbol('details');
      const version = Symbol('version');

      module = new Module({ id, slug, title, isBeta, sections, details, version });
    });

    it('should set redirectionUrl', function () {
      // given
      const url = '/parcours/COMBINIX1';

      // when
      module.setRedirectionUrl(url);

      // then
      expect(module.redirectionUrl).to.equal(url);
    });
  });
});
