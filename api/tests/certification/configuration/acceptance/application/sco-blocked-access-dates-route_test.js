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
    it('should return 201 HTTP status code', async function () {
      // given
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const options = {
        method: 'PATCH',
        url: '/api/admin/sco-blocked-access-dates/lycee',
        headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
        payload: { data: { attributes: { value: '2025-12-15' } } },
      };
      databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(201);
      const [updatedValue] = await knex('sco-blocked-access-dates')
        .where({ scoOrganizationType: 'lycee' })
        .pluck('reopeningDate');
      expect(updatedValue.toDateString()).to.equal(new Date('2025-12-15').toDateString());
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
          attributes: {
            scoOrganizationType: 'college',
            reopeningDate: scoBlockedAccessDates.collegeDate.toISOString(),
          },
        },
        {
          type: 'sco-blocked-access-dates',
          attributes: {
            scoOrganizationType: 'lycee',
            reopeningDate: scoBlockedAccessDates.lyceeDate.toISOString(),
          },
        },
      ]);
    });
  });
});
