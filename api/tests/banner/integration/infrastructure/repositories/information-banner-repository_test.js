import * as informationBannerRepository from '../../../../../src/banner/infrastructure/repositories/information-banner-repository.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/temporary-storage/index.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Infrastructure | Repository | Banner | information-banner-repository', function () {
  context('#get', function () {
    beforeEach(async function () {
      const bannerTemporaryStorage = temporaryStorage.withPrefix('information-banners:');
      bannerTemporaryStorage.flushAll();
    });
    context('when no information banners have been stored for given id', function () {
      it('should return an empty information banner', async function () {
        const id = 'pix-target';
        const emptyBanner = domainBuilder.banner.buildEmptyInformationBanner({ id });

        const bannerInformation = await informationBannerRepository.get({ id });

        expect(bannerInformation).to.deep.equal(emptyBanner);
      });
    });
    context('when an information banner has been stored for given id', function () {
      it('should return an empty information banner', async function () {
        const id = 'pix-other-target';
        const storedBanner = { message: '[fr]Texte de la bannière[/fr][en]Banner text[/en]', severity: 'info' };

        const bannerTemporaryStorage = temporaryStorage.withPrefix('information-banners:');
        await bannerTemporaryStorage.save({ key: id, value: [storedBanner], expirationDelaySeconds: 10 });

        const expectedInformationBanner = domainBuilder.banner.buildInformationBanner({
          id,
          banners: [{ ...storedBanner, id: 'pix-other-target:1' }],
        });

        const bannerInformation = await informationBannerRepository.get({ id });

        expect(bannerInformation).to.deep.equal(expectedInformationBanner);
      });
    });
  });
});
