import nock from 'nock';

import { AttestationTemplateFixture } from '../fixtures/index.js';

export function mockAttestationStorage(attestation) {
  const template = AttestationTemplateFixture.getStream();
  nock('http://attestations.fake.endpoint.example.net:80')
    .get(`/attestations.bucket/${attestation.templateName}.pdf?x-id=GetObject`)
    .reply(200, () => template);
  return template;
}

export function mockAttestationStorageUpload({ attestation, isFailed = false }) {
  return nock('http://attestations.fake.endpoint.example.net:80')
    .put(`/attestations.bucket/${attestation.templateName}.pdf?x-id=PutObject`)
    .reply(isFailed ? 500 : 200)
    .persist();
}
