import { config } from '../../../shared/config.js';
import { S3ObjectStorageProvider } from '../../../shared/storage/infrastructure/providers/S3ObjectStorageProvider.js';

class AttestationStorage extends S3ObjectStorageProvider {
  static createClient() {
    return super.createClient(config.attestations.storage.client);
  }
}

export { AttestationStorage };
