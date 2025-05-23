/**
 * @typedef {import ('../../../../domain/models/v3/Certificate.js').Certificate} Certificate
 */
import path from 'node:path';
import * as url from 'node:url';

import dayjs from 'dayjs';

import { ComplementaryCertificationKeys } from '../../../../../shared/domain/models/ComplementaryCertificationKeys.js';
import { FRANCE_COMPETENCES_PROFESSIONAL_START_DATE, MAX_LEVEL } from '../../../../domain/constants.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __badgesDirname = url.fileURLToPath(new URL('../badges/', import.meta.url));

/**
 * @param {Object} params
 * @param {Certificate} params.data
 */
const generateV3AttestationTemplate = function ({ pdf, data, translate }) {
  // Global
  pdf.image(path.resolve(__dirname, 'background.jpg'), 0, 0, {
    width: pdf.page.width,
    height: pdf.page.height,
  });

  // Main content
  pdf
    .font('Nunito-Bold')
    .fontSize(45)
    .fillColor('#253858')
    .text(translate('certification.certificate.v3.main-content.title'), 82, 150, { width: 380 });
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(
      _formatText(
        translate('certification.certificate.v3.main-content.certification-center', {
          certificationCenter: data.certificationCenter,
        }),
      ),
      {
        width: 380,
        lineGap: 2,
      },
    )
    .moveDown(0.5);
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(translate('certification.certificate.v3.main-content.delivered-at.label'), 82, 249)
    .moveDown(0.5);
  pdf
    .font('Nunito-Bold')
    .fontSize(25)
    .text(`${data.firstName} ${data.lastName.toUpperCase()}`, { width: 380, lineGap: -7 })
    .moveDown(0.25);

  const birthdate = dayjs(data.birthdate).format('DD/MM/YYYY');
  const deliveredAt = dayjs(data.deliveredAt).format('DD/MM/YYYY');

  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(
      _formatText(
        translate('certification.certificate.v3.main-content.birth', {
          birthdate,
          birthplace: data.birthplace,
        }),
      ),
    );
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(
      _formatText(
        translate('certification.certificate.v3.main-content.delivered-at.date', {
          deliveredAt,
        }),
      ),
      82,
      364,
    );
  pdf
    .font('Roboto-Regular')
    .fontSize(10)
    .fillColor('#6b778b')
    .text(translate('certification.certificate.v3.main-content.signature'), 82, 440);

  // QR code content
  pdf.font('Roboto-Medium').fontSize(11).fillColor('#5e6c84').text(data.verificationCode, 142, 467).moveDown(0.25);
  pdf
    .font('Roboto-Regular')
    .fontSize(8.25)
    .text(translate('certification.certificate.v3.qr-code-content.explanation'), {
      continued: true,
      width: 137,
    })
    .text(translate('certification.certificate.v3.qr-code-content.link.label'), {
      link: translate('certification.certificate.v3.qr-code-content.link.url'),
    });

  // Score content
  pdf
    .font('Nunito-Bold')
    .fontSize(35)
    .fillColor('#253858')
    .text(data.pixScore, 611, 99, {
      width: 84,
      align: 'center',
    })
    .moveDown(0.05);
  pdf.font('Roboto-Regular').fontSize(16).fillColor('#5e6c84').text(data.maxReachableScore, {
    width: 84,
    align: 'center',
  });

  const globalLevel = data.globalLevel;

  if (data.globalLevel) {
    pdf
      .font('Roboto-Regular')
      .fontSize(11)
      .fillColor('#6b778b')
      .text(translate('certification.certificate.v3.score-content.global-level'), 550, 195, {
        width: 205,
        align: 'center',
      });

    const globalLevelLabel = globalLevel.getLevelLabel(translate);
    pdf
      .roundedRect(
        652 - (pdf.widthOfString(globalLevelLabel) * 2) / 2,
        212,
        pdf.widthOfString(globalLevelLabel) * 2,
        24,
        24,
      )
      .fill('#6712FF');
    pdf
      .font('Nunito-Bold')
      .fontSize(14)
      .fillColor('#FFFFFF')
      .text(globalLevelLabel, 652 - (pdf.widthOfString(globalLevelLabel) * 2) / 2, 214, {
        width: pdf.widthOfString(globalLevelLabel) * 2,
        align: 'center',
      });

    const globalLevelSummary = globalLevel.getSummaryLabel(translate);
    const globalLevelDescription = globalLevel.getDescriptionLabel(translate);
    pdf
      .font('Nunito-Bold')
      .fontSize(11)
      .fillColor('#253858')
      .text(translate('certification.certificate.v3.score-content.level-explanation'), 530, 250, {
        width: 250,
      })
      .moveDown(0.5)
      .font('Roboto-Medium')
      .fontSize(9.5)
      .text(globalLevelSummary)
      .moveDown(0.5)
      .font('Roboto-Regular')
      .fontSize(9.5)
      .text(globalLevelDescription);
  }

  if (data.acquiredComplementaryCertification) {
    pdf
      .font('Nunito-Bold')
      .fontSize(11)
      .fillColor('#253858')
      .text(translate('certification.certificate.v3.complementary-content.title'), 530, 470, {
        width: 250,
      });
    pdf.image(path.resolve(__badgesDirname, `${ComplementaryCertificationKeys.CLEA}.png`), 628, 490, {
      width: 50,
      height: 50,
    });
  }
};

const generateV2AttestationTemplate = function ({ pdf, data, translate, isFrenchDomainExtension }) {
  // Global
  pdf.image(path.resolve(__dirname, 'v2-background.png'), 0, 0, {
    width: pdf.page.width,
    height: pdf.page.height,
  });

  // Main content
  pdf
    .font('Nunito-Bold')
    .fontSize(35)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.title'), 254, 21);

  pdf
    .font('Roboto-Regular')
    .fontSize(12)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.description'), 0, 79, {
      width: pdf.page.width,
      align: 'center',
    });

  const birthdate = dayjs(data.birthdate).format('DD/MM/YYYY');
  const deliveredAt = dayjs(data.deliveredAt).format('DD/MM/YYYY');

  pdf
    .font('Roboto-Regular')
    .fontSize(10)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.main-content.first-and-last-names'), 157, 118, { continued: true })
    .font('Roboto-Medium')
    .text(`${data.firstName} ${data.lastName}`)
    .moveDown(0.4)
    .font('Roboto-Regular')
    .text(translate('certification.attestation.v2.main-content.birth'), { continued: true })
    .font('Roboto-Medium')
    .text(`${birthdate} ${translate('certification.attestation.v2.main-content.from-birthplace')} ${data.birthplace}`)
    .moveDown(0.4)
    .font('Roboto-Regular')
    .text(translate('certification.attestation.v2.main-content.certification-center'), { continued: true })
    .font('Roboto-Medium')
    .text(data.certificationCenter)
    .moveDown(0.4)
    .font('Roboto-Regular')
    .text(translate('certification.attestation.v2.main-content.delivered-at'), { continued: true })
    .font('Roboto-Medium')
    .text(deliveredAt);

  if (
    _isDeliveredAfterProfessionalizingStartDate({
      isFrenchDomainExtension,
      deliveredAt: data.deliveredAt,
    })
  ) {
    pdf
      .font('Roboto-Regular')
      .fontSize(8)
      .fillColor('#6b778b')
      .text(translate('certification.attestation.v2.main-content.professionalizing-certification-message'), 157, 185, {
        width: 300,
      });
  }

  // score content
  pdf
    .font('Nunito-Bold')
    .fontSize(24)
    .fillColor('#253858')
    .text(data.pixScore, 70, 142, { width: 71, align: 'center' });

  pdf.font('Roboto-Medium').fontSize(10).text(`${data.maxReachableScore}*`, 70, 175, { width: 71, align: 'center' });

  pdf
    .font('Roboto-Medium')
    .fontSize(8)
    .fillColor('#253858')
    .text(
      translate('certification.attestation.v2.score-content.max-reachable-level-indication', {
        maxReachableScore: data.maxReachableScore,
        maxReachableLevelOnCertificationDate: data.maxReachableLevelOnCertificationDate,
      }),
      55,
      pdf.page.height - 54,
      { height: 5 },
    );

  if (data.maxReachableLevelOnCertificationDate < MAX_LEVEL) {
    pdf.text(
      translate('certification.attestation.v2.score-content.absolute-max-level-indication'),
      55,
      pdf.page.height - 43,
      { height: 5 },
    );
  }

  // QR code content
  pdf
    .font('Roboto-Regular')
    .fontSize(10)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.qr-code-content.title'), 345, 225, { width: 200 });

  pdf
    .font('Roboto-Regular')
    .fontSize(10)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.qr-code-content.verification-code'), 345, 250, {
      width: 195,
      align: 'center',
    })
    .moveDown(0.8)
    .fontSize(12)
    .fillColor('#ffffff')
    .text(data.verificationCode, {
      width: 195,
      align: 'center',
    })
    .moveDown(1.2)
    .fontSize(8)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.qr-code-content.link.description'), {
      width: 195,
      align: 'center',
    })
    .moveDown(0.2)
    .font('Roboto-Medium')
    .fillColor('#095dec')
    .text(translate('certification.attestation.v2.qr-code-content.link.label'), {
      link: translate('certification.attestation.v2.qr-code-content.link.url'),
      width: 195,
      align: 'center',
    });

  // other content
  pdf
    .font('Roboto-Regular')
    .fontSize(10)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.signature'), 345, 602);

  pdf
    .font('Roboto-Regular')
    .fontSize(8)
    .fillColor('#253858')
    .text(translate('certification.attestation.v2.not-a-certificate'), 0, pdf.page.height - 17, {
      width: pdf.page.width,
      height: 10,
      align: 'center',
    });

  // complementary certification content
  if (data.certifiedBadges.length > 0) {
    pdf
      .font('Roboto-Regular')
      .fontSize(10)
      .fillColor('#253858')
      .text(translate('certification.attestation.v2.complementary-certification-title'), 345, 338);

    pdf.roundedRect(343, 355, 197, 160, 5).fillOpacity(0.8).fill('#ffffff');

    pdf
      .font('Roboto-Regular')
      .fontSize(8)
      .fillOpacity(1)
      .fillColor('#253858')
      .text(data.certifiedBadges[0].message, 351, 452, { width: 190 });

    const badge = data.certifiedBadges[0].stickerUrl.slice(39, -4);
    pdf.image(path.resolve(__badgesDirname, `${badge}.png`), 343, 373, {
      fit: [197, 70],
      align: 'center',
      valign: 'center',
    });
  }

  // competences content
  pdf
    .font('Roboto-Regular')
    .fontSize(10)
    .fillColor('#253858')
    .text(
      translate('certification.attestation.v2.competences-content.title', {
        maxReachableLevelOnCertificationDate: data.maxReachableLevelOnCertificationDate,
      }),
      55,
      225,
    );

  [247, 352, 480, 608, 712].forEach((y, index) => {
    pdf
      .font('Roboto-Regular')
      .fontSize(9)
      .fillColor('#253858')
      .text(data.resultCompetenceTree.areas[index].title, 65, y);

    pdf.text(translate('certification.attestation.v2.competences-content.level'), 276, y);
  });

  __fillCompetences({ parameters: [272, 295, 319], areaNumber: 0 });
  __fillCompetences({ parameters: [375, 400, 424, 447], areaNumber: 1 });
  __fillCompetences({ parameters: [504, 528, 552, 575], areaNumber: 2 });
  __fillCompetences({ parameters: [632, 656, 679], areaNumber: 3 });
  __fillCompetences({ parameters: [736, 759], areaNumber: 4 });

  function __fillCompetences({ parameters, areaNumber }) {
    parameters.forEach((y, index) => {
      const resultCompetence = data.resultCompetenceTree.areas[areaNumber].resultCompetences[index];
      pdf.fillColor('#253858').fillOpacity(1).text(resultCompetence.name, 65, y);

      if (_isLevelShouldBeDisplayed(resultCompetence.level)) {
        pdf.fillColor('#253858').fillOpacity(1).text(resultCompetence.level, 290, y);
      } else {
        pdf.rect(65, y, 200, 11).fillOpacity(0.5).fill('#ffffff');
      }
    });
  }
};

function _isDeliveredAfterProfessionalizingStartDate({ isFrenchDomainExtension, deliveredAt }) {
  return isFrenchDomainExtension && deliveredAt?.getTime() >= FRANCE_COMPETENCES_PROFESSIONAL_START_DATE.getTime();
}

function _isLevelShouldBeDisplayed(level) {
  return level > 0;
}

function _formatText(content) {
  return content.replaceAll('&#x2F;', '/').replaceAll('&#39;', "'");
}

export { generateV2AttestationTemplate, generateV3AttestationTemplate };
