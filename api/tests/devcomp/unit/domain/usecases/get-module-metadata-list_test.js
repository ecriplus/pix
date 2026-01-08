import { getModuleMetadataList } from '../../../../../src/devcomp/domain/usecases/get-module-metadata-list.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Devcomp | Domain | UseCases | get-module-metadata-list', function () {
  it('should return a list of ModuleMetadata', async function () {
    // given
    const firstModule = Symbol('firstModule');
    const secondModule = Symbol('secondModule');

    const moduleMetadataRepository = {
      list: sinon.stub(),
    };

    const moduleMetadataList = [firstModule, secondModule];
    moduleMetadataRepository.list.withArgs().resolves(moduleMetadataList);

    // when
    const result = await getModuleMetadataList({ moduleMetadataRepository });

    // then
    expect(result).to.deep.equal(moduleMetadataList);
  });
});
