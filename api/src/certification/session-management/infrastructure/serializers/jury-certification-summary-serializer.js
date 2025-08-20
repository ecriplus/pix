import lodash from 'lodash';

const { Serializer } = jsonapiSerializer;

const { omit, get } = lodash;

import jsonapiSerializer from 'jsonapi-serializer';

const serialize = function (juryCertificationSummary, meta, { translate }) {
  return new Serializer('jury-certification-summary', {
    transform(juryCertificationSummary) {
      const result = omit(juryCertificationSummary, 'certificationIssueReports');
      result.certificationObtained = juryCertificationSummary.getCertificationLabel(translate);
      result.examinerComment = get(juryCertificationSummary, 'certificationIssueReports[0].description');
      result.numberOfCertificationIssueReports = juryCertificationSummary.certificationIssueReports.length;
      result.numberOfCertificationIssueReportsWithRequiredAction =
        juryCertificationSummary.certificationIssueReports.filter(
          (issueReport) => issueReport.isImpactful && issueReport.resolvedAt === null,
        ).length;
      return result;
    },
    attributes: [
      'firstName',
      'lastName',
      'status',
      'pixScore',
      'createdAt',
      'completedAt',
      'isPublished',
      'examinerComment',
      'numberOfCertificationIssueReports',
      'numberOfCertificationIssueReportsWithRequiredAction',
      'isFlaggedAborted',
      'certificationObtained',
    ],
    meta,
  }).serialize(juryCertificationSummary);
};

export { serialize };
