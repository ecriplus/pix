import { temporaryStorage } from '../../../shared/infrastructure/temporary-storage/index.js';
import { InformationBanner } from '../../domain/models/information-banner.js';

const bannerTemporaryStorage = temporaryStorage.withPrefix('information-banners:');

const get = async function ({ id }) {
  const banners = await bannerTemporaryStorage.get(id);
  if (!banners) {
    return InformationBanner.empty({ id });
  }

  return new InformationBanner({ id, banners });
};

export { get };
