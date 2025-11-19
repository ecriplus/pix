import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
  knex,
} from '../../../../test-helper.js';

describe('Certification | Configuration | Acceptance | API | sco-blocked-access-dates-route', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('PATCH /api/admin/sco-blocked-access-dates', function () {
    it('should return 201 HTTP status code when updating valid entry', async function () {
      // given
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const options = {
        method: 'PATCH',
        url: '/api/admin/sco-blocked-access-dates/LYCEE',
        headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
        payload: { data: { attributes: { value: '2025-12-15' } } },
      };
      databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(201);
      const [updatedValue] = await knex('certification_sco_blocked_access_dates')
        .where({ scoOrganizationTagName: 'LYCEE' })
        .pluck('reopeningDate');
      expect(updatedValue.toDateString()).to.equal(new Date('2025-12-15').toDateString());
    });
    it('should return 404 HTTP status code when updating invalid entry', async function () {
      // given
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const options = {
        method: 'PATCH',
        url: '/api/admin/sco-blocked-access-dates/LYCEE',
        headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
        payload: { data: { attributes: { value: '2025-12-15' } } },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  describe('GET /api/admin/sco-blocked-access-dates', function () {
    it('should return 200 HTTP status code and values', async function () {
      // given
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const options = {
        method: 'GET',
        url: '/api/admin/sco-blocked-access-dates',
        headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
      };

      const scoBlockedAccessDates = databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      const result = JSON.parse(response.payload);
      expect(result.data).to.deep.equal([
        {
          type: 'sco-blocked-access-dates',
          id: 'COLLEGE',
          attributes: {
            'reopening-date': scoBlockedAccessDates.collegeDate.toISOString(),
          },
        },
        {
          type: 'sco-blocked-access-dates',
          id: 'LYCEE',
          attributes: {
            'reopening-date': scoBlockedAccessDates.lyceeDate.toISOString(),
          },
        },
      ]);
    });
  });
});
