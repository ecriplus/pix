import sinon from 'sinon';

import { ModuleDoesNotExistError } from '../../../../../src/devcomp/domain/errors.js';
import moduleService from '../../../../../src/devcomp/domain/services/module-service.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, expect } from '../../../../test-helper.js';

const { getModuleByLink } = moduleService;

describe('#getModuleByLink', function () {
  it('should throw an error if link does not match /modules/<slug> pattern', async function () {
    const error = await catchErr(getModuleByLink)({ link: 'bidule' });
    expect(error).to.be.instanceOf(ModuleDoesNotExistError);
    expect(error.message).to.contain('bidule');
  });
  it('should throw an error if link slug does not match any module', async function () {
    const moduleRepository = { getBySlug: sinon.stub() };
    moduleRepository.getBySlug.withArgs({ slug: 'wrong-slug' }).rejects(new NotFoundError());
    const error = await catchErr(getModuleByLink)({ link: '/modules/wrong-slug', moduleRepository });
    expect(error).to.be.instanceOf(ModuleDoesNotExistError);
  });
  it('should return module if link slug matches a module', async function () {
    //given
    const moduleRepository = { getBySlug: sinon.stub() };
    const expectedModule = Symbol('module');
    moduleRepository.getBySlug.withArgs({ slug: 'good-slug' }).resolves(expectedModule);

    //when
    const module = await getModuleByLink({ link: '/modules/good-slug', moduleRepository });

    //then
    expect(module).to.equal(expectedModule);
  });
  it('should return module if absolute link slug matches a module', async function () {
    //given
    const moduleRepository = { getBySlug: sinon.stub() };
    const expectedModule = Symbol('module');
    moduleRepository.getBySlug.withArgs({ slug: 'good-slug' }).resolves(expectedModule);

    //when
    const module = await getModuleByLink({ link: 'https://app.pix.fr/modules/good-slug', moduleRepository });

    //then
    expect(module).to.equal(expectedModule);
  });
});
