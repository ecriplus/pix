import { config } from '../../../shared/config.js';
import { cryptoService } from '../../../shared/domain/services/crypto-service.js';

async function getModuleByShortId({ shortId, encryptedRedirectionUrl, moduleRepository }) {
  const module = await moduleRepository.getByShortId({ shortId });

  if (encryptedRedirectionUrl) {
    let redirectionUrl = null;
    try {
      redirectionUrl = await cryptoService.decrypt(encryptedRedirectionUrl, config.module.secret);
      if (redirectionUrl) {
        module.setRedirectionUrl(redirectionUrl);
      }
    } catch {
      return module;
    }
  }
  return module;
}

export { getModuleByShortId };
