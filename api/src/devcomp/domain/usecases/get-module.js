import { config } from '../../../shared/config.js';
import { cryptoService } from '../../../shared/domain/services/crypto-service.js';

async function getModule({ slug, redirectionHash, moduleRepository }) {
  const module = await moduleRepository.getBySlug({ slug });

  if (redirectionHash) {
    let redirectionUrl = null;
    try {
      redirectionUrl = await cryptoService.decrypt(redirectionHash, config.module.secret);
      if (redirectionUrl) {
        module.setRedirectionUrl(redirectionUrl);
      }
    } catch {
      return module;
    }
  }
  return module;
}

export { getModule };
