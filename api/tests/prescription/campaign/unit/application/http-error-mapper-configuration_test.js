import { campaignDomainErrorMappingConfiguration } from '../../../../../src/prescription/campaign/application/http-error-mapper-configuration.js';
import {
  CampaignParticipationDoesNotBelongToUser,
  OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError,
  UserNotAuthorizedToCreateCampaignError,
} from '../../../../../src/prescription/campaign/domain/errors.js';
import { HttpErrors } from '../../../../../src/shared/application/http-errors.js';
import { expect } from '../../../../test-helper.js';

describe('Prescription | Campaign | Unit | Application | HttpErrorMapperConfiguration', function () {
  it('instantiates ForbiddenError when CampaignParticipationDoesNotBelongToUser', async function () {
    //given
    const httpErrorMapper = campaignDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === CampaignParticipationDoesNotBelongToUser.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new CampaignParticipationDoesNotBelongToUser());

    //then
    expect(error).to.be.instanceOf(HttpErrors.ForbiddenError);
  });

  it('instantiates ForbiddenError when UserNotAuthorizedToCreateCampaignError', async function () {
    //given
    const httpErrorMapper = campaignDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === UserNotAuthorizedToCreateCampaignError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new UserNotAuthorizedToCreateCampaignError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.ForbiddenError);
  });

  it('instantiates ForbiddenError when OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError', async function () {
    //given
    const httpErrorMapper = campaignDomainErrorMappingConfiguration.find(
      (httpErrorMapper) =>
        httpErrorMapper.name === OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(
      new OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError(),
    );

    //then
    expect(error).to.be.instanceOf(HttpErrors.ForbiddenError);
  });
});
