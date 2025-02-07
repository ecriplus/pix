import iconv from 'iconv-lite';

import { CommonCsvLearnerParser } from '../../../../../../../src/prescription/learner-management/infrastructure/serializers/csv/common-csv-learner-parser.js';
import { catchErr, expect } from '../../../../../../test-helper.js';

describe('Unit | Infrastructure | CommonCsvLearnerParser', function () {
  context('getEncoding', function () {
    const config = {
      headers: [
        {
          name: 'prénom',
          property: 'firstName',
          isRequired: false,
          checkEncoding: true,
        },
      ],
      acceptedEncoding: ['utf8'],
    };

    const input = `prénom
      Éçéà niño véga`;

    it('should throw an error if there is no acceptedEncoding', async function () {
      // given
      const encodedInput = iconv.encode(input, 'win1252');
      const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);

      // when
      const error = await catchErr(parser.getEncoding, parser)();

      // then
      expect(error[0].code).to.equal('ENCODING_NOT_SUPPORTED');
    });

    it('should not throw an error if encoding is supported', async function () {
      // given
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);

      // when
      const call = () => parser.getEncoding();
      // then
      expect(call).to.not.throw();
    });
  });

  context('When file does not match requirements', function () {
    const config = {
      headers: [
        {
          name: 'nom',
          property: 'lastName',
          isRequired: true,
        },
        {
          name: 'prénom',
          property: 'firstName',
          isRequired: false,
        },
        {
          name: 'GodZilla',
          property: 'kaiju',
          isRequired: true,
        },
      ],
      acceptedEncoding: ['utf8'],
    };

    it('should throw an error if the file is not csv', async function () {
      // given
      const input = `nom\\prénom\\
      Beatrix\\The\\`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);

      // when
      const error = await catchErr(parser.parse, parser)('utf8');

      // then
      expect(error[0].code).to.equal('BAD_CSV_FORMAT');
    });

    context('Error FieldMismatch', function () {
      it('should throw an error if the is more columns than headers', async function () {
        // given
        const input = `nom;prénom;GodZilla
      Beatrix;The;cheese;of;truth`;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);
        // when
        const error = await catchErr(parser.parse, parser)('utf8');

        // then
        expect(error[0].code).to.equal('BAD_CSV_FORMAT');
      });
      it('should throw an error if the is less columns than headers', async function () {
        // given
        const input = `nom;GodZilla;prénom
        Beatrix;`;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);
        // when
        const error = await catchErr(parser.parse, parser)('utf8');

        // then
        expect(error[0].code).to.equal('BAD_CSV_FORMAT');
      });
    });

    it('should throw all errors on missing header', async function () {
      // given
      const input = `prénom;
      The;`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);

      // when
      const errors = await catchErr(parser.parse, parser)('utf8');

      // then
      expect(errors).to.lengthOf(2);
      expect(errors[0].code).to.equal('HEADER_REQUIRED');
      expect(errors[0].meta.field).to.equal('nom');
      expect(errors[1].code).to.equal('HEADER_REQUIRED');
      expect(errors[1].meta.field).to.equal('GodZilla');
    });

    it('should throw all errors on unknown header', async function () {
      // given
      const input = `nom;Gidorah;King Kong;GodZilla
      The;;;`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);

      // when
      const errors = await catchErr(parser.parse, parser)('utf8');

      // then
      expect(errors).to.lengthOf(2);

      expect(errors[0].code).to.equal('HEADER_UNKNOWN');
      expect(errors[0].meta.field).to.equal('Gidorah');
      expect(errors[1].code).to.equal('HEADER_UNKNOWN');
      expect(errors[1].meta.field).to.equal('King Kong');
    });

    it('should throw all errors on unknown and missing header', async function () {
      // given
      const input = `prénom;Gidorah
      The;`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);
      parser.getEncoding();

      // when
      const errors = await catchErr(parser.parse, parser)('utf8');

      // then
      expect(errors).to.lengthOf(3);

      expect(errors[0].code).to.equal('HEADER_REQUIRED');
      expect(errors[0].meta.field).to.equal('nom');
      expect(errors[1].code).to.equal('HEADER_REQUIRED');
      expect(errors[1].meta.field).to.equal('GodZilla');
      expect(errors[2].code).to.equal('HEADER_UNKNOWN');
      expect(errors[2].meta.field).to.equal('Gidorah');
    });
  });

  context('when the header is correctly formed', function () {
    context('when there are lines', function () {
      let config;
      beforeEach(function () {
        config = {
          headers: [
            {
              name: 'nom',
              property: 'lastName',
              isRequired: true,
            },
            {
              name: 'prénom',
              property: 'firstName',
              isRequired: false,
            },
          ],
          acceptedEncoding: ['utf8'],
        };
      });

      it('should not throw on valid CSV', function () {
        // given
        const input = `nom;prénom
        Beatrix;The
        `;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);

        // when
        const call = () => parser.parse('utf8');
        // then
        expect(call).to.not.throw();
      });

      it('should return CommonOrganizationLearner from CSV', function () {
        // given
        const input = `prénom;nom
        Godzilla;King of monsters
        `;

        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new CommonCsvLearnerParser(encodedInput, config.headers, config.acceptedEncoding);

        // when
        const result = parser.parse('utf8');

        // then
        expect(result).lengthOf(1);
        expect(result[0]).to.be.deep.equal({
          prénom: 'Godzilla',
          nom: 'King of monsters',
        });
      });
    });
  });
});
