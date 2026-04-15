import 'dayjs/locale/fr.js';

import { expect, use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSorted from 'chai-sorted';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import MockDate from 'mockdate';
import nock from 'nock';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { DatamartBuilder } from '../datamart/datamart-builder/datamart-builder.js';
import { knex as datamartKnex } from '../datamart/knex-database-connection.js';
import { knex as datawarehouseKnex } from '../datawarehouse/knex-database-connection.js';
import { DatabaseBuilder } from '../db/database-builder/database-builder.js';
import { disconnect, knex } from '../db/knex-database-connection.js';
import { createServer } from '../server.js';
import { createMaddoServer } from '../server.maddo.js';
import * as tutorialRepository from '../src/devcomp/infrastructure/repositories/tutorial-repository.js';
import * as missionRepository from '../src/school/infrastructure/repositories/mission-repository.js';
import { featureToggles } from '../src/shared/infrastructure/feature-toggles/index.js';
import { JobClient } from '../src/shared/infrastructure/jobs/JobClient.js';
import { clearMutex, quitMutex } from '../src/shared/infrastructure/mutex/RedisMutex.js';
import * as areaRepository from '../src/shared/infrastructure/repositories/area-repository.js';
import * as challengeRepository from '../src/shared/infrastructure/repositories/challenge-repository.js';
import * as competenceRepository from '../src/shared/infrastructure/repositories/competence-repository.js';
import * as courseRepository from '../src/shared/infrastructure/repositories/course-repository.js';
import * as frameworkRepository from '../src/shared/infrastructure/repositories/framework-repository.js';
import * as skillRepository from '../src/shared/infrastructure/repositories/skill-repository.js';
import * as thematicRepository from '../src/shared/infrastructure/repositories/thematic-repository.js';
import * as tubeRepository from '../src/shared/infrastructure/repositories/tube-repository.js';
import * as customChaiHelpers from './tooling/chai-custom-helpers/index.js';
import { jobChai } from './tooling/chai-custom-helpers/jobs/expect-job.js';
import * as domainBuilder from './tooling/domain-builder/factory/index.js';
import { buildLearningContent as learningContentBuilder } from './tooling/learning-content-builder/index.js';
import { increaseCurrentTestTimeout } from './tooling/mocha-tools.js';
import { mockAttestationStorage, mockAttestationStorageUpload } from './tooling/mocks/attestation-storage.mock.js';
import { hFake } from './tooling/mocks/hapi.mock.js';
import { HttpTestServer } from './tooling/server/http-test-server.js';
import { catchErr, catchErrSync, preventStubsToBeCalledUnexpectedly } from './tooling/test-utils/error.js';
import { createTempFile, isSameBinary, removeTempFile } from './tooling/test-utils/file.js';
import {
  generateAuthenticatedUserRequestHeaders,
  generateInjectOptions,
  generateValidRequestAuthorizationHeaderForApplication,
} from './tooling/test-utils/http-server.js';
import { parseNDJSON } from './tooling/test-utils/json.js';
import { wait, waitForStreamFinalizationToBeDone } from './tooling/test-utils/wait.js';

// Init Dayjs configuration
dayjs.extend(localizedFormat);

// Extends Chai helpers
chaiUse(chaiAsPromised);
chaiUse(chaiSorted);
chaiUse(sinonChai);
chaiUse(jobChai);
Object.values(customChaiHelpers).forEach(chaiUse);

// Init Database builders
const databaseBuilder = await DatabaseBuilder.create({
  knex,
  beforeEmptyDatabase: () => {
    // Sometimes, truncating tables may cause the first ran test to timeout, so
    // we increase the timeout to ensure we don't have flaky tests
    increaseCurrentTestTimeout(2000);
  },
});
// TEMPORARY WORKAROUND
databaseBuilder.factory.learningContent.injectNock(nock);

// Init Datamart builders
const datamartBuilder = await DatamartBuilder.create({
  knex: datamartKnex,
});

/* eslint-disable mocha/no-top-level-hooks */
before(async function () {
  nock.disableNetConnect();
  nock.enableNetConnect('localhost:9090'); // Unmock S3 storage

  try {
    await JobClient.instance.initialize();
  } catch {
    // pgBoss is not available on unit tests
  }
});

afterEach(async function () {
  sinon.restore();
  nock.cleanAll();
  frameworkRepository.clearCache();
  areaRepository.clearCache();
  competenceRepository.clearCache();
  thematicRepository.clearCache();
  tubeRepository.clearCache();
  skillRepository.clearCache();
  challengeRepository.clearCache();
  courseRepository.clearCache();
  tutorialRepository.clearCache();
  missionRepository.clearCache();
  await featureToggles.resetDefaults();
  await datamartBuilder.clean();
  await clearMutex();
  try {
    await JobClient.instance.flushJobs();
  } catch {
    // pgBoss is not available on unit tests
  }
  return databaseBuilder.clean();
});

after(async function () {
  await quitMutex();
  try {
    await JobClient.instance.stop();
  } catch {
    // pgBoss is not available on unit tests
  }
  return await disconnect();
});
/* eslint-enable mocha/no-top-level-hooks */

async function mockLearningContent(learningContent) {
  const scope = databaseBuilder.factory.learningContent.build(learningContent);
  await databaseBuilder.commit();
  return scope;
}

// eslint-disable-next-line mocha/no-exports
export {
  catchErr,
  catchErrSync,
  createMaddoServer,
  createServer,
  createTempFile,
  databaseBuilder,
  datamartBuilder,
  datamartKnex,
  datawarehouseKnex,
  domainBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  generateInjectOptions,
  generateValidRequestAuthorizationHeaderForApplication,
  hFake,
  HttpTestServer,
  isSameBinary,
  knex,
  learningContentBuilder,
  mockAttestationStorage,
  mockAttestationStorageUpload,
  MockDate,
  mockLearningContent,
  nock,
  parseNDJSON,
  preventStubsToBeCalledUnexpectedly,
  removeTempFile,
  sinon,
  wait,
  waitForStreamFinalizationToBeDone,
};
