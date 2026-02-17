import { AttestationStorage } from '../../../../../src/quest/infrastructure/storage/attestation-storage.js';
import { S3ObjectStorageProvider } from '../../../../../src/shared/storage/infrastructure/providers/S3ObjectStorageProvider.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Storage | AttestationStorage', function () {
  it('should create a S3 Client', function () {
    // given & when
    const client = AttestationStorage.createClient();

    // then
    expect(client).to.be.instanceOf(S3ObjectStorageProvider);
  });
});
