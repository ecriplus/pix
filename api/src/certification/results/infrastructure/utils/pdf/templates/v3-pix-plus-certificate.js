/**
 * @typedef {import ('../../../../domain/models/v3/Certificate.js').Certificate} Certificate
 */
import path from 'node:path';
import * as url from 'node:url';

import dayjs from 'dayjs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * @param {object} params
 * @param {Certificate} params.data
 */
export default function generateV3PixPlusAttestationTemplate({ pdf, data, translate }) {
  // Global
  pdf.image(path.resolve(__dirname, 'assets/v3-pix-plus-background.jpg'), 0, 0, {
    width: pdf.page.width,
    height: pdf.page.height,
  });

  const pixPlusLogo = {
    DROIT: 'pix-plus-droit.png',
    PRO_SANTE: 'pix-plus-pro-sante.png',
    EDU_1ER_DEGRE: 'pix-plus-edu.png',
    EDU_2ND_DEGRE: 'pix-plus-edu.png',
    EDU_CPE: 'pix-plus-edu.png',
  }[data.certificationFramework];

  if (pixPlusLogo) {
    pdf.image(path.resolve(__dirname, `assets/${pixPlusLogo}`), 40, 10, {
      width: 110,
      height: 110,
    });
  }

  // Main content
  pdf
    .font('Nunito-Bold')
    .fontSize(32)
    .fillColor('#253858')
    .text(translate('certification.certificate.v3.main-content.title-pix-plus'), 82, 150, { width: 380 })
    .moveUp(0.1);
  pdf
    .font('Nunito-Bold')
    .fontSize(32)
    .fillColor('#253858')
    .text(_formatText(translate(`certification.certificate.v3.pix-plus-labels.${data.certificationFramework}`)), {
      width: 380,
    })
    .moveDown(0.05);
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
    .moveDown(2);
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(translate('certification.certificate.v3.main-content.delivered-at.label'))
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
  const globalLevel = data.globalLevel;

  if (data.globalLevel) {
    const globalLevelLabel = globalLevel.getLevelLabel(translate);

    if (data.globalLevel.meshLevel === 'LEVEL_ADMISSIBLE') {
      pdf.image(path.resolve(__dirname, 'assets/badges/pix-plus-edu-admissible.png'), 594, 80, {
        width: 120,
        height: 120,
      });

      pdf
        .roundedRect(
          652 - (pdf.widthOfString(globalLevelLabel) * 2) / 2,
          202,
          pdf.widthOfString(globalLevelLabel) * 2,
          24,
          24,
        )
        .fill('#B9D8CD');
      pdf
        .font('Roboto-Regular')
        .fontSize(12)
        .fillColor('#004726')
        .text(globalLevelLabel, 652 - (pdf.widthOfString(globalLevelLabel) * 2) / 2, 207, {
          width: pdf.widthOfString(globalLevelLabel) * 2,
          align: 'center',
        });
    }

    const globalLevelSummary = globalLevel.getSummaryLabel(translate);
    const globalLevelDescription = globalLevel.getDescriptionLabel(translate);
    pdf
      .font('Roboto-Medium')
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
      .text(globalLevelDescription, { lineGap: 5 });
  }
}

function _formatText(content) {
  return content.replaceAll('&#x2F;', '/').replaceAll('&#39;', "'");
}
