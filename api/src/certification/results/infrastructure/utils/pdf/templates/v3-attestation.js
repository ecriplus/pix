import path from 'node:path';
import * as url from 'node:url';

import dayjs from 'dayjs';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const generateV3AttestationTemplate = (pdf, data) => {
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
  pdf.font('Nunito-Bold').fontSize(45).fillColor('#253858').text('Certification Pix', 82, 150, { width: 380 });
  pdf
    .font('Roboto-Regular')
    .fontSize(11)
    .text(`Centre de certification : ${data.certificationCenter}`, {
      width: 380,
      lineGap: 2,
    })
    .moveDown(0.5);
  pdf.font('Roboto-Regular').fontSize(11).text('délivrée à', 82, 249).moveDown(0.5);
  pdf
    .font('Nunito-Bold')
    .fontSize(25)
    .text(`${data.firstName} ${data.lastName.toUpperCase()}`, { width: 380, lineGap: -7 })
    .moveDown(0.25);

  const birthdate = dayjs(data.birthdate).format('DD/MM/YYYY');
  const deliveredAt = dayjs(data.deliveredAt).format('DD/MM/YYYY');

  pdf.font('Roboto-Regular').fontSize(11).text(`né(e) le : ${birthdate} à ${data.birthplace}`);
  pdf.font('Roboto-Regular').fontSize(11).text(`le ${deliveredAt}`, 82, 364);
  pdf.font('Roboto-Regular').fontSize(11).fillColor('#6b778b').text('Benjamin Marteau, directeur du GIP Pix', 82, 438);

  // QR code content
  pdf.font('Roboto-Medium').fontSize(11).fillColor('#5e6c84').text(data.verificationCode, 142, 467).moveDown(0.25);
  pdf
    .font('Roboto-Regular')
    .fontSize(8.25)
    .text('Pour vérifier l’authenticité de cette attestation, utilisez ce code sur ', {
      continued: true,
      width: 137,
    })
    .text('app.pix.fr/verification-certificat', {
      link: 'http://www.example.com',
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
  pdf.font('Roboto-Regular').fontSize(11).fillColor('#6b778b').text('Niveau global', 550, 195, {
    width: 205,
    align: 'center',
  });
  const level = 'Intermédiaire 1';
  pdf.roundedRect(650 - (pdf.widthOfString(level) * 2) / 2, 212, pdf.widthOfString(level) * 2, 24, 24).fill('#6712FF');
  pdf
    .font('Nunito-Bold')
    .fontSize(14)
    .fillColor('#FFFFFF')
    .text(level, 650 - (pdf.widthOfString(level) * 2) / 2, 214, {
      width: pdf.widthOfString(level) * 2,
      align: 'center',
    });
  pdf
    .font('Nunito-Bold')
    .fontSize(11)
    .fillColor('#253858')
    .text('Votre niveau signifie que :', 530, 250, {
      width: 250,
    })
    .moveDown(0.5)
    .font('Roboto-Medium')
    .fontSize(9.5)
    .text(
      'Vous avez des pratiques numériques avancées et disposez  de connaissances solides qui vous permettent de faire  face seul(e) à des situations nouvelles. Vous pouvez venir  en aide à d’autres personnes.',
    )
    .moveDown(0.5)
    .font('Roboto-Regular')
    .fontSize(9.5)
    .text(
      'Vous êtes capable de recourir à des outils spécialisés pour rechercher de l’information de façon fiable, gérer des ré- seaux sociaux, éditer des images et des vidéos. Vous savez  produire des analyses de données et des représentations  graphiques adaptées. Vous savez mettre en place un environnement numérique (installation et paramétrage). Vous  connaissez les enjeux autour du traçage et de la collecte de  données. Vous comprenez les impacts environnementaux  et sociétaux des usages numériques et savez adapter vos  pratiques',
    );
};

export default generateV3AttestationTemplate;
