import dayjs from 'dayjs';
import { getDocument } from 'pdfjs-dist';

import { generate } from '../../../../../../../src/certification/results/infrastructure/utils/pdf/v3-certification-attestation-pdf.js';
import { getI18n } from '../../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { domainBuilder, expect } from '../../../../../../test-helper.js';

describe('Integration | Infrastructure | Utils | Pdf | V3 Certification Attestation Pdf', function () {
  let i18n;

  beforeEach(function () {
    i18n = getI18n();
  });

  it('should generate a PDF buffer', async function () {
    // given
    const certificates = [domainBuilder.certification.results.buildV3CertificationAttestation()];

    // when
    const pdfStream = await generate({ certificates, i18n });

    const pdfBuffer = await _convertStreamToBuffer(pdfStream);

    // then
    expect(pdfBuffer.toString().substring(1, 4)).to.equal('PDF');
    expect(pdfBuffer.toString()).to.contain('/Type /Pages\n/Count 1');
  });

  it('should generate a page for each certificate', async function () {
    // given
    const certificates = [
      domainBuilder.certification.results.buildV3CertificationAttestation(),
      domainBuilder.certification.results.buildV3CertificationAttestation(),
      domainBuilder.certification.results.buildV3CertificationAttestation(),
    ];

    // when
    const pdfStream = await generate({
      certificates,
      i18n,
    });

    const pdfBuffer = await _convertStreamToBuffer(pdfStream);

    // then
    expect(pdfBuffer.toString()).to.contain('/Type /Pages\n/Count 3');
  });

  it('should display data content', async function () {
    // given
    const certificates = [
      domainBuilder.certification.results.buildV3CertificationAttestation({
        id: 123,
        firstName: 'Alain',
        lastName: 'Cendy',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId: 456,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 256,
        sessionId: 789,
      }),
      domainBuilder.certification.results.buildV3CertificationAttestation({
        id: 128,
        firstName: 'Alain',
        lastName: 'Terieur',
        birthdate: '2013-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId: 123,
        date: new Date('2020-01-01'),
        verificationCode: 'P-123456BS',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2020-05-05'),
        certificationCenter: 'Centre des centres',
        pixScore: 256,
        sessionId: 789,
      }),
    ];

    // when
    const pdfStream = await generate({ certificates, i18n });

    const pdfBuffer = await _convertStreamToBuffer(pdfStream);

    // then
    const parsedPdf = await getDocument({ data: new Uint8Array(pdfBuffer) }).promise;

    const pagesContent = [];
    for (let i = 1; i <= parsedPdf.numPages; i++) {
      const page = await parsedPdf.getPage(i);
      const content = await page.getTextContent();
      pagesContent.push(content.items.map((item) => item.str).join(' '));
    }

    expect(pagesContent.length).to.equal(2);

    pagesContent.forEach((pageContent, index) => {
      expect(pageContent).to.include(`Centre de certification : ${certificates[index].certificationCenter}`);
      expect(pageContent).to.include(`${certificates[index].firstName} ${certificates[index].lastName.toUpperCase()}`);
      expect(pageContent).to.include(
        `né(e) le : ${dayjs(certificates[index].birthdate).format('DD/MM/YYYY')} à ${certificates[index].birthplace}`,
      );
      expect(pageContent).to.include(`le ${dayjs(certificates[index].deliveredAt).format('DD/MM/YYYY')}`);
      expect(pageContent).to.include(`${certificates[index].verificationCode}`);
      expect(pageContent).to.include(`${certificates[index].pixScore}`);
      expect(pageContent).to.include('Indépendant 1');
      expect(pageContent).to.include(`${certificates[index].maxReachableScore}`);
    });
  });
});

function _convertStreamToBuffer(streamData) {
  return new Promise(function (resolve) {
    const chunks = [];

    streamData.on('readable', () => {
      let chunk;
      while (null !== (chunk = streamData.read())) {
        chunks.push(chunk);
      }
    });

    streamData.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
