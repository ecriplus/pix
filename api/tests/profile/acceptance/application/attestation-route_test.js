import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  nock,
} from '../../../test-helper.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

describe('Profile | Acceptance | Application | Attestation Route ', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/users/{userId}/attestations/{attestationKey}', function () {
    it('should be ok', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const attestation = databaseBuilder.factory.buildAttestation();
      await databaseBuilder.commit();

      nock('http://attestations.fake.endpoint.example.net:80')
        .get(`/attestations.bucket/${attestation.templateName}?x-id=GetObject`)
        .reply(200, () => fs.createReadStream(path.join(__dirname, 'template.pdf')));

      const options = {
        method: 'GET',
        headers: generateAuthenticatedUserRequestHeaders({ userId }),
        url: `/api/users/${userId}/attestations/${attestation.key}`,
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('GET /api/users/{userId}/attestation-details', function () {
    it('should be ok', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;

      await databaseBuilder.commit();
      const options = {
        method: 'GET',
        headers: generateAuthenticatedUserRequestHeaders({ userId }),
        url: `/api/users/${userId}/attestation-details`,
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
