import PDFDocument from 'pdfkit';

import { GlobalCertificationLevel } from '../../../../shared/domain/models/GlobalCertificationLevel.js';
import { findIntervalIndexFromScore } from '../../../domain/services/find-interval-index-from-score.js';
import generateV3AttestationTemplate from './templates/v3-attestation.js';

const generate = ({ certificates, i18n }) => {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
  });

  doc.info = {
    Title: i18n.__('certification-confirmation.file-metadata.title'),
    Author: 'Pix',
    Keywords: 'v3',
    CreationDate: new Date(),
  };

  certificates.forEach((certificate, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // En attendant PIX-17106
    const globalCertificationLevel = new GlobalCertificationLevel({
      meshLevel: findIntervalIndexFromScore({
        score: certificate.pixScore,
      }),
    });

    generateV3AttestationTemplate({
      pdf: doc,
      data: certificate,
      translate: i18n.__,
      globalCertificationLevel,
    });
  });

  doc.end();

  return doc;
};

export { generate };
