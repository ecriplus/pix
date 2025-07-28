import dayjs from 'dayjs';

import { usecases as certificationSharedUsecases } from '../../../../src/certification/shared/domain/usecases/index.js';
import * as requestResponseUtils from '../../../../src/shared/infrastructure/utils/request-response-utils.js';
import { normalizeAndRemoveAccents } from '../../../shared/infrastructure/utils/string-utils.js';
import { Certificate } from '../domain/models/v3/Certificate.js';
import { usecases } from '../domain/usecases/index.js';
import * as certificateSerializer from '../infrastructure/serializers/certificate-serializer.js';
import * as privateCertificateSerializer from '../infrastructure/serializers/private-certificate-serializer.js';
import * as v3CertificationAttestationPdf from '../infrastructure/utils/pdf/generate-pdf-certificate.js';
import * as v2CertificationAttestationPdf from '../infrastructure/utils/pdf/generate-v2-pdf-certificate.js';

const getCertificateByVerificationCode = async function (
  request,
  h,
  dependencies = { requestResponseUtils, certificateSerializer },
) {
  let certificate;
  const i18n = request.i18n;
  const verificationCode = request.payload.verificationCode;
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);

  const certificationCourse = await usecases.getCertificationCourseByVerificationCode({ verificationCode });

  if (certificationCourse.isV3()) {
    certificate = await usecases.getCertificate({
      certificationCourseId: certificationCourse.getId(),
      locale,
    });
  } else {
    certificate = await usecases.getShareableCertificate({
      certificationCourseId: certificationCourse.getId(),
      locale,
    });
  }
  return dependencies.certificateSerializer.serialize({ certificate, translate: i18n.__ });
};

const getCertificate = async function (
  request,
  h,
  dependencies = { requestResponseUtils, certificateSerializer, privateCertificateSerializer },
) {
  const certificationCourseId = request.params.certificationCourseId;
  const translate = request.i18n.__;
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);

  const certificationCourse = await certificationSharedUsecases.getCertificationCourse({ certificationCourseId });

  let certificate;
  if (certificationCourse.isV3()) {
    certificate = await usecases.getCertificate({
      certificationCourseId: certificationCourse.getId(),
      locale,
    });
    return dependencies.certificateSerializer.serialize({ certificate, translate });
  } else {
    certificate = await usecases.getPrivateCertificate({
      certificationCourseId: certificationCourse.getId(),
      locale,
    });
    return dependencies.privateCertificateSerializer.serialize(certificate, { translate });
  }
};

const findUserCertificates = async function (request) {
  const userId = request.auth.credentials.userId;
  const translate = request.i18n.__;

  const privateCertificates = await usecases.findUserPrivateCertificates({ userId });
  return privateCertificateSerializer.serialize(privateCertificates, { translate });
};

const getPDFCertificate = async function (
  request,
  h,
  dependencies = { v2CertificationAttestationPdf, v3CertificationAttestationPdf },
) {
  const certificationCourseId = request.params.certificationCourseId;
  const { i18n } = request;
  const { isFrenchDomainExtension } = request.query;
  const locale = i18n.getLocale();

  const certificate = await usecases.getCertificate({ certificationCourseId, locale });

  const fileName = i18n.__('certification.certificate.file-name', {
    deliveredAt: dayjs(certificate.deliveredAt).format('YYYYMMDD'),
  });

  if (certificate instanceof Certificate) {
    return h
      .response(
        dependencies.v3CertificationAttestationPdf.generate({
          certificates: [certificate],
          i18n,
        }),
      )
      .code(200)
      .header('Content-Disposition', `attachment; filename=${fileName}`)
      .header('Content-Type', 'application/pdf');
  }

  return h
    .response(
      dependencies.v2CertificationAttestationPdf.generate({
        certificates: [certificate],
        i18n,
        isFrenchDomainExtension,
      }),
    )
    .code(200)
    .header('Content-Disposition', `attachment; filename=${fileName}`)
    .header('Content-Type', 'application/pdf');
};

const getSessionCertificates = async function (
  request,
  h,
  dependencies = { v2CertificationAttestationPdf, v3CertificationAttestationPdf },
) {
  const { i18n } = request;

  const sessionId = request.params.sessionId;
  const isFrenchDomainExtension = request.query.isFrenchDomainExtension;
  const certificates = await usecases.getCertificatesForSession({
    sessionId,
  });

  const translatedFileName = i18n.__('certification.certificate.file-name', {
    deliveredAt: dayjs(certificates[0].deliveredAt).format('YYYYMMDD'),
  });

  if (certificates.every((certificate) => certificate instanceof Certificate)) {
    return h
      .response(
        dependencies.v3CertificationAttestationPdf.generate({
          certificates,
          i18n,
        }),
      )
      .code(200)
      .header('Content-Disposition', `attachment; filename=session-${sessionId}-${translatedFileName}`)
      .header('Content-Type', 'application/pdf');
  }

  return h
    .response(
      dependencies.v2CertificationAttestationPdf.generate({
        certificates,
        i18n,
        isFrenchDomainExtension,
      }),
    )
    .header('Content-Disposition', `attachment; filename=session-${sessionId}-${translatedFileName}`)
    .header('Content-Type', 'application/pdf');
};

const downloadDivisionCertificates = async function (
  request,
  h,
  dependencies = { v2CertificationAttestationPdf, v3CertificationAttestationPdf },
) {
  const organizationId = request.params.organizationId;
  const { i18n } = request;
  const { division, isFrenchDomainExtension } = request.query;
  const locale = i18n.getLocale();

  const certificates = await usecases.findCertificatesForDivision({
    organizationId,
    division,
    locale,
  });

  if (certificates.some((certificate) => certificate instanceof Certificate)) {
    const v3Certificates = certificates.filter((certificate) => certificate instanceof Certificate);
    const normalizedDivision = normalizeAndRemoveAccents(division);

    const translatedFileName = i18n.__('certification.certificate.file-name', {
      deliveredAt: dayjs(certificates[0].deliveredAt).format('YYYYMMDD'),
    });

    return h
      .response(
        dependencies.v3CertificationAttestationPdf.generate({
          certificates: v3Certificates,
          i18n,
        }),
      )
      .code(200)
      .header('Content-Disposition', `attachment; filename=${normalizedDivision}-${translatedFileName}`)
      .header('Content-Type', 'application/pdf');
  }

  const now = dayjs();
  const fileName = `${now.format('YYYYMMDD')}_attestations_${division}.pdf`;

  return h
    .response(
      dependencies.v2CertificationAttestationPdf.generate({
        certificates,
        i18n,
        isFrenchDomainExtension,
      }),
    )
    .header('Content-Disposition', `attachment; filename=${fileName}`)
    .header('Content-Type', 'application/pdf');
};

const certificateController = {
  getCertificate,
  findUserCertificates,
  getCertificateByVerificationCode,
  getPDFCertificate,
  getSessionCertificates,
  downloadDivisionCertificates,
};

export { certificateController };
