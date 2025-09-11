import { ModuleMetadata } from '../../../../../../src/devcomp/domain/models/module/ModuleMetadata.js';
import { DomainError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | Module | ModuleMetadata', function () {
  let id, isBeta, slug, title, duration, image;

  beforeEach(function () {
    id = '12a3a2b4-e873-4789-ae1c-57f6f2b99890';
    slug = 'tmp-module-test';
    title = "Test d'un module";
    isBeta = false;
    duration = 10;
    image = 'emile';
  });

  it('should init and keep attributes', function () {
    // when
    const module = new ModuleMetadata({ id, slug, title, isBeta, duration, image });

    // then
    expect(module.id).to.equal(id);
    expect(module.slug).to.equal(slug);
    expect(module.title).to.equal(title);
    expect(module.isBeta).to.equal(isBeta);
    expect(module.duration).to.equal(duration);
    expect(module.image).to.equal(image);
  });

  describe('if a module does not have an id', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            slug,
            title,
            isBeta,
            duration,
            image,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The id is required for a module metadata');
    });
  });

  describe('if a module does not have a slug', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            id,
            title,
            isBeta,
            duration,
            image,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The slug is required for a module metadata');
    });
  });

  describe('if a module does not have a title', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            id,
            slug,
            isBeta,
            duration,
            image,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The title is required for a module metadata');
    });
  });

  describe('if a module does not have a field isBeta', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            id,
            title,
            slug,
            duration,
            image,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('Field isBeta is required for a module metadata');
    });
  });

  describe('if a module does not have a duration', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            id,
            title,
            slug,
            isBeta,
            image,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The duration is required for a module metadata');
    });
  });

  describe('if the module duration is 0', function () {
    it('should throw an error', function () {
      // given
      const duration = 0;

      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            duration,
            id,
            title,
            slug,
            isBeta,
            image,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The duration must be a positive integer for a module metadata');
    });
  });

  describe('if the module duration is negative', function () {
    it('should throw an error', function () {
      // given
      const duration = -5;

      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            duration,
            id,
            title,
            slug,
            isBeta,
            image,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The duration must be a positive integer for a module metadata');
    });
  });

  describe('if the module does not have an image', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new ModuleMetadata({
            duration,
            id,
            title,
            slug,
            isBeta,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The image is required for a module metadata');
    });
  });
});
