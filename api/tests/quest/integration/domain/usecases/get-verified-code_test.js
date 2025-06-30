import { VerifiedCode } from '../../../../../src/quest/domain/models/VerifiedCode.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | getVerifiedCode', function () {
  it('it returns verified code for a campaign', async function () {
    const campaign = databaseBuilder.factory.buildCampaign();
    await databaseBuilder.commit();

    const verifiedCode = await usecases.getVerifiedCode({ code: campaign.code });

    expect(verifiedCode).to.be.instanceOf(VerifiedCode);
    expect(verifiedCode.id).to.equal(campaign.code);
  });

  it('it throws a NotFoundError when the provided code is not linked to a campaign', async function () {
    const err = await catchErr(usecases.getVerifiedCode)({
      code: 'NOCAMPAIGN',
    });

    expect(err).to.be.instanceOf(NotFoundError);
  });
});
