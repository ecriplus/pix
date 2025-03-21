import path from 'node:path';
import * as url from 'node:url';

import dayjs from 'dayjs';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const generateV3AttestationTemplate = ({ pdf, data, translate, globalCertificationLevel }) => {
  // Global
  pdf.image(path.resolve(__dirname, 'background.jpg'), 0, 0, {
    width: pdf.page.width,
    height: pdf.page.height,
  });

  pdf.registerFont(
    'Nunito-Bold',
    `${__dirname}/../../../../../../shared/infrastructure/utils/pdf/fonts/Nunito-Bold.ttf`,
  );
  pdf.registerFont(
    'Roboto-Regular',
    `${__dirname}/../../../../../../shared/infrastructure/utils/pdf/fonts/Roboto-Regular.ttf`,
  );
  pdf.registerFont(
    'Roboto-Medium',
    `${__dirname}/../../../../../../shared/infrastructure/utils/pdf/fonts/Roboto-Medium.ttf`,
  );

  // Main content
  pdf
    .font('Nunito-Bold')
    .fontSize(45)
    .fillColor('#253858')
    .text(translate('certification.attestation.v3.main-content.title'), 82, 150, { width: 380 });
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(
      translate('certification.attestation.v3.main-content.certification-center', {
        certificationCenter: data.certificationCenter,
      }),
      {
        width: 380,
        lineGap: 2,
      },
    )
    .moveDown(0.5);
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(translate('certification.attestation.v3.main-content.delivered-at.label'), 82, 249)
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
      translate('certification.attestation.v3.main-content.birth', {
        birthdate,
        birthplace: data.birthplace,
      }).replaceAll('&#x2F;', '/'),
    );
  pdf.font('Roboto-Regular').fontSize(11).text(
    translate('certification.attestation.v3.main-content.delivered-at.date', {
      deliveredAt,
    }).replaceAll('&#x2F;', '/'),
    82,
    364,
  );
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .fillColor('#6b778b')
    .text(translate('certification.attestation.v3.main-content.signature'), 82, 438);

  // QR code content
  pdf.font('Roboto-Medium').fontSize(11).fillColor('#5e6c84').text(data.verificationCode, 142, 467).moveDown(0.25);
  pdf
    .font('Roboto-Regular')
    .fontSize(8.25)
    .text(translate('certification.attestation.v3.qr-code-content.explanation'), {
      continued: true,
      width: 137,
    })
    .text(translate('certification.attestation.v3.qr-code-content.link.label'), {
      link: translate('certification.attestation.v3.qr-code-content.link.url'),
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
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .fillColor('#6b778b')
    .text(translate('certification.attestation.v3.score-content.global-level'), 550, 195, {
      width: 205,
      align: 'center',
    });

  const globalLevelLabel = globalCertificationLevel.getLevelLabel(translate);
  pdf
    .roundedRect(
      650 - (pdf.widthOfString(globalLevelLabel) * 2) / 2,
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
    .text(globalLevelLabel, 650 - (pdf.widthOfString(globalLevelLabel) * 2) / 2, 214, {
      width: pdf.widthOfString(globalLevelLabel) * 2,
      align: 'center',
    });
  pdf
    .font('Nunito-Bold')
    .fontSize(11)
    .fillColor('#253858')
    .text(translate('certification.attestation.v3.score-content.level-explanation'), 530, 250, {
      width: 250,
    })
    .moveDown(0.5)
    .font('Roboto-Medium')
    .fontSize(9.5)
    .text('globalCertificationLevel.getSummaryLabel(translate)')
    .moveDown(0.5)
    .font('Roboto-Regular')
    .fontSize(9.5)
    .text('globalCertificationLevel.getDescriptionLabel(translate)');
};

export default generateV3AttestationTemplate;
