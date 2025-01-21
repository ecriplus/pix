import { createServer, expect } from '../../../test-helper.js';

describe('Acceptance | Controller | Open Api', function () {
  // Increase the test timeout because swagger.json endpoints can be long to generate/respond.
  this.timeout(5000);

  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  context('Pix API', function () {
    describe('GET /api/swagger.json', function () {
      it('should respond with a 200', async function () {
        // given
        const options = {
          method: 'GET',
          url: '/api/swagger.json',
          headers: {},
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.info.title).to.deep.equal('Welcome to the Pix api catalog');
      });
    });

    context('Documentation pages', function () {
      beforeEach(async function () {
        await server.start();
      });

      describe('GET /api/documentation', function () {
        it('should respond with a 200', async function () {
          // given
          const options = {
            method: 'GET',
            url: '/api/documentation/',
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.contain('Welcome to the Pix api catalog');
        });
      });
    });
  });

  context('Livret scolaire LSU/LSL', function () {
    describe('GET /livret-scolaire/swagger.json', function () {
      it('should respond with a 200', async function () {
        // given
        const options = {
          method: 'GET',
          url: '/livret-scolaire/swagger.json',
          headers: {},
        };
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.info.title).to.deep.equal('Welcome to the Pix LSU/LSL Open Api');
      });
    });

    context('Documentation pages', function () {
      beforeEach(async function () {
        await server.start();
      });

      describe('GET /livret-scolaire/documentation', function () {
        it('should respond with a 200', async function () {
          // given
          const options = {
            method: 'GET',
            url: '/livret-scolaire/documentation/',
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.contain('Welcome to the Pix LSU/LSL Open Api');
        });
      });
    });
  });

  context('Pole Emploi', function () {
    describe('GET /pole-emploi/swagger.json', function () {
      it('should respond with a 200', async function () {
        // given
        const options = {
          method: 'GET',
          url: '/pole-emploi/swagger.json',
          headers: {},
        };
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.info.title).to.deep.equal('Pix Pôle emploi Open Api');
      });
    });

    context('Documentation page', function () {
      beforeEach(async function () {
        await server.start();
      });

      describe('GET /pole-emploi/documentation', function () {
        it('should respond with a 200', async function () {
          // given
          const options = {
            method: 'GET',
            url: '/pole-emploi/documentation/',
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.contain('Pix Pôle emploi Open Api');
        });
      });
    });
  });

  context('Authorization-server', function () {
    describe('GET /authorization-server/swagger.json', function () {
      it('should respond with a 200', async function () {
        // given
        const options = {
          method: 'GET',
          url: '/authorization-server/swagger.json',
          headers: {},
        };
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.info.title).to.deep.equal('Welcome to the Pix Authorization server');
      });
    });

    context('Documentation page', function () {
      beforeEach(async function () {
        await server.start();
      });

      describe('GET /authorization-server/documentation', function () {
        it('should respond with a 200', async function () {
          // given
          const options = {
            method: 'GET',
            url: '/authorization-server/documentation/',
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.contain('Welcome to the Pix Authorization server');
        });
      });
    });
  });

  context('Parcoursup', function () {
    describe('GET /parcoursup/swagger.json', function () {
      it('should respond with a 200', async function () {
        // given
        const options = {
          method: 'GET',
          url: '/parcoursup/swagger.json',
          headers: {},
        };
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.info.title).to.deep.equal('Pix Parcoursup Open Api');
      });
    });

    context('Documentation page', function () {
      beforeEach(async function () {
        await server.start();
      });

      describe('GET /parcoursup/documentation', function () {
        it('should respond with a 200', async function () {
          // given
          const options = {
            method: 'GET',
            url: '/parcoursup/documentation/',
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.contain('Pix Parcoursup Open Api');
        });
      });
    });
  });
});
