import { learnerManagementDomainErrorMappingConfiguration } from '../../../../../src/prescription/learner-management/application/http-error-mapper-configuration.js';
import {
  AggregateImportError,
  CouldNotDeleteLearnersError,
  SiecleXmlImportError,
} from '../../../../../src/prescription/learner-management/domain/errors.js';
import { HttpErrors } from '../../../../../src/shared/application/errors/http-errors.js';
import { expect } from '../../../../test-helper.js';

describe('Prescription | Learner Management | Unit | Application | HttpErrorMapperConfiguration', function () {
  it('instantiates PreconditionFailedError when AggregateImportError', async function () {
    //given
    const httpErrorMapper = learnerManagementDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === AggregateImportError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new AggregateImportError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.PreconditionFailedError);
  });

  it('instantiates PreconditionFailedError when CouldNotDeleteLearnersError', async function () {
    //given
    const httpErrorMapper = learnerManagementDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === CouldNotDeleteLearnersError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new CouldNotDeleteLearnersError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.PreconditionFailedError);
  });

  it('instantiates PreconditionFailedError when SiecleXmlImportError', async function () {
    //given
    const httpErrorMapper = learnerManagementDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === SiecleXmlImportError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new SiecleXmlImportError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.PreconditionFailedError);
  });
});
