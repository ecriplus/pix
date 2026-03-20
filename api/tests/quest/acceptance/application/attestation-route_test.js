import fs from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import * as url from 'node:url';

import FormData from 'form-data';
import streamToPromise from 'stream-to-promise';

import { PIX_ADMIN } from '../../../../src/authorization/domain/constants.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  getFakeAttestationTemplate,
  knex,
  mockAttestationStorageUpload,
} from '../../../test-helper.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

describe('Quest | Acceptance | Application | Attestation Route ', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('POST /api/admin/attestations', function () {
    context('when user has one of the authorized roles', function () {
      let userId;

      beforeEach(async function () {
        userId = databaseBuilder.factory.buildUser.withRole({ role: PIX_ADMIN.ROLES.SUPER_ADMIN }).id;
        await databaseBuilder.commit();
      });
      context('when all parameters are valid', function () {
        it('creates attestation', async function () {
          const templateKey = 'key';
          const templateName = 'name';

          const formData = new FormData();
          formData.append('templateKey', templateKey);
          formData.append('templateName', templateName);
          formData.append('templateFile', getFakeAttestationTemplate());
          mockAttestationStorageUpload({ attestation: { templateName } });
          const options = {
            method: 'POST',
            url: '/api/admin/attestations',
            headers: {
              ...formData.getHeaders(),
              ...generateAuthenticatedUserRequestHeaders({ userId }),
            },
            payload: await streamToPromise(formData),
          };

          // when
          const response = await server.inject(options);

          // then
          const createdAttestation = await knex('attestations').where('key', templateKey).first();

          expect(response.statusCode).to.equal(204);

          expect(createdAttestation.templateName).to.equal('name');
        });
      });

      context('when file is not a pdf', function () {
        it('should return a 400 error code', async function () {
          // given
          const formData = new FormData();
          formData.append('templateKey', 'key');
          formData.append('templateName', 'name');

          const testFilePath = `${__dirname}/testFile_temp.jpeg`;
          await writeFile(testFilePath, Buffer.alloc(0));
          formData.append('templateFile', fs.createReadStream(testFilePath));

          const options = {
            method: 'POST',
            url: '/api/admin/attestations',
            headers: {
              ...formData.getHeaders(),
              ...generateAuthenticatedUserRequestHeaders({ userId }),
            },
            payload: await streamToPromise(formData),
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(400);

          // after
          await unlink(testFilePath);
        });
      });
    });
  });
});
