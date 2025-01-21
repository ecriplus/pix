import { InvalidScoWhitelistError } from '../../../../../../src/certification/configuration/domain/errors.js';
import { importScoWhitelist } from '../../../../../../src/certification/configuration/domain/usecases/import-sco-whitelist.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { catchErr, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | import-sco-whitelist', function () {
  let centerRepository;

  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });

    centerRepository = {
      addToWhitelistByExternalIds: sinon.stub(),
      resetWhitelist: sinon.stub(),
    };
  });

  it('should whitelist a center', async function () {
    // given
    centerRepository.resetWhitelist.resolves();
    centerRepository.addToWhitelistByExternalIds.resolves(1);

    // when
    await importScoWhitelist({
      externalIds: [12],
      centerRepository,
    });

    // then
    expect(centerRepository.resetWhitelist).to.have.been.calledOnce;
    expect(centerRepository.addToWhitelistByExternalIds).to.have.been.calledOnceWithExactly({ externalIds: [12] });
  });

  it('should reject new whitelist when not valid', async function () {
    // given
    centerRepository.resetWhitelist.resolves();
    centerRepository.addToWhitelistByExternalIds.resolves(1);

    // when
    const error = await catchErr((externalIds) =>
      importScoWhitelist({
        externalIds,
        centerRepository,
      }),
    )([11, 12]);

    // then
    expect(error).to.be.instanceOf(InvalidScoWhitelistError);
    expect(error.message).to.equal('La liste blanche contient des données invalides.');
  });
});
