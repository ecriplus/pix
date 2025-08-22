import { JuryCertificationSummary } from '../../../../../../src/certification/session-management/domain/read-models/JuryCertificationSummary.js';
import * as serializer from '../../../../../../src/certification/session-management/infrastructure/serializers/jury-certification-summary-serializer.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { domainBuilder, expect } from '../../../../../test-helper.js';

describe('Unit | Serializer | JSONAPI | jury-certification-summary-serializer', function () {
  describe('#serialize()', function () {
    let translate;
    let modelJuryCertifSummary;
    let expectedJsonApi;

    it('should convert a JuryCertificationSummary model object into JSON API data', function () {
      // given
      translate = getI18n().__;
      const issueReport = domainBuilder.buildCertificationIssueReport.impactful({
        certificationCourseId: 1,
        description: 'someComment',
        resolvedAt: null,
      });
      modelJuryCertifSummary = new JuryCertificationSummary({
        id: 1,
        firstName: 'someFirstName',
        lastName: 'someLastName',
        status: 'someStatus',
        pixScore: 123,
        createdAt: new Date('2020-04-20T04:05:06Z'),
        completedAt: new Date('2020-04-25T04:05:06Z'),
        isPublished: true,
        certificationIssueReports: [issueReport],
        isFlaggedAborted: false,
        complementaryCertificationLabelObtained: 'Pix+ Droit',
        complementaryCertificationKeyObtained: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
      });

      expectedJsonApi = {
        data: {
          type: 'jury-certification-summaries',
          id: modelJuryCertifSummary.id.toString(),
          attributes: {
            'first-name': modelJuryCertifSummary.firstName,
            'last-name': modelJuryCertifSummary.lastName,
            status: modelJuryCertifSummary.status,
            'pix-score': modelJuryCertifSummary.pixScore,
            'created-at': modelJuryCertifSummary.createdAt,
            'completed-at': modelJuryCertifSummary.completedAt,
            'is-published': modelJuryCertifSummary.isPublished,
            'examiner-comment': 'someComment',
            'number-of-certification-issue-reports': 1,
            'number-of-certification-issue-reports-with-required-action': 1,
            'is-flagged-aborted': false,
            'certification-obtained': 'Pix+ Droit',
          },
        },
        meta: {},
      };

      // when
      const meta = {};
      const json = serializer.serialize(modelJuryCertifSummary, meta, { translate });

      // then
      expect(json).to.deep.equal(expectedJsonApi);
    });

    it('should translate the certification taken label', function () {
      // given
      modelJuryCertifSummary = new JuryCertificationSummary({
        id: 1,
        firstName: 'someFirstName',
        lastName: 'someLastName',
        status: 'someStatus',
        pixScore: 123,
        createdAt: new Date('2020-04-20T04:05:06Z'),
        completedAt: new Date('2020-04-25T04:05:06Z'),
        isPublished: true,
        certificationIssueReports: [],
        isFlaggedAborted: false,
        complementaryCertificationLabelObtained: 'CléA Numérique',
        complementaryCertificationKeyObtained: ComplementaryCertificationKeys.CLEA,
      });

      // when
      const meta = {};
      const json = serializer.serialize(modelJuryCertifSummary, meta, { translate });

      // then
      expect(json.data.attributes['certification-obtained']).to.equal(
        translate('jury-certification-summary.comment.DOUBLE_CORE_CLEA'),
      );
    });
  });
});
