import { Module } from '../../../../../src/quest/domain/models/Module.js';
import * as moduleRepository from '../../../../../src/quest/infrastructure/repositories/module-repository.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Repositories | Module Repository', function () {
  describe('#getByUserIdAndModuleIds', function () {
    it('should call getUserModuleStatuses from modulesApi', async function () {
      // given
      const userId = 1;
      const moduleIds = [1, 2];
      const modules = [{ id: 1, title: 'title', slug: 'slug' }];

      const modulesApiStub = {
        getUserModuleStatuses: sinon.stub(),
      };
      modulesApiStub.getUserModuleStatuses.withArgs({ userId, moduleIds }).resolves(modules);

      // when
      const result = await moduleRepository.getByUserIdAndModuleIds({ userId, moduleIds, modulesApi: modulesApiStub });

      // then
      expect(modulesApiStub.getUserModuleStatuses).to.be.called;
      expect(result[0]).to.be.an.instanceOf(Module);
    });
  });
});
