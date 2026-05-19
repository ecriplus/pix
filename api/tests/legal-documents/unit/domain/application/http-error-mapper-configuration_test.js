import { legalDocumentsDomainErrorMappingConfiguration } from '../../../../../src/legal-documents/application/http-error-mapper-configuration.js';
import { LegalDocumentInvalidDateError } from '../../../../../src/legal-documents/domain/errors.js';
import { HttpErrors } from '../../../../../src/shared/application/http-errors.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Legal Documents | Application | HttpErrorMapperConfiguration', function () {
  context('when mapping "LegalDocumentInvalidDateError"', function () {
    it('returns an UnprocessableEntity Http Error', function () {
      //given
      const httpErrorMapper = legalDocumentsDomainErrorMappingConfiguration.find(
        (httpErrorMapper) => httpErrorMapper.name === LegalDocumentInvalidDateError.name,
      );

      //when
      const error = httpErrorMapper.httpErrorFn(new LegalDocumentInvalidDateError());

      //then
      expect(error).to.be.instanceOf(HttpErrors.UnprocessableEntityError);
    });
  });
});
