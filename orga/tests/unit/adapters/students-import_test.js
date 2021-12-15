import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import StudentImportsAdapter from '../../../app/adapters/students-import';

module('Unit | Adapters | Students import', function (hooks) {
  setupTest(hooks);
  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:students-import');
    adapter.ajax = sinon.stub();
  });

  module('#addStudentsCsv', function () {
    test('should build addStudentsCsv url from organizationId', async function (assert) {
      // when
      await adapter.addStudentsCsv(1, [Symbol()]);

      // then
      assert.ok(
        adapter.ajax.calledWith('http://localhost:3000/api/organizations/1/schooling-registrations/import-csv', 'POST')
      );
    });
  });

  module('#replaceStudentsCsv', function () {
    test('should build replaceStudentsCsv url from organizationId', async function (assert) {
      // when
      await adapter.replaceStudentsCsv(1, [Symbol()]);

      // then
      assert.ok(
        adapter.ajax.calledWith('http://localhost:3000/api/organizations/1/schooling-registrations/replace-csv', 'POST')
      );
    });
  });

  module('#importStudentsSiecle', function () {
    const zipFile = new File([''], 'archive.zip', { type: 'application/zip' });
    const csvFile = new File([''], 'file.csv', { type: 'text/csv' });
    const acceptedFormat = 'csv';

    test('should throw an error if format is not handled', async function (assert) {
      assert.expect(1);

      try {
        // when
        await adapter.importStudentsSiecle(1, [zipFile], acceptedFormat);
        assert.fail('It should not be possible to upload a zip');
      } catch (error) {
        // then
        sinon.assert.notCalled(adapter.ajax);
        assert.equals(error.message, StudentImportsAdapter.FORMAT_NOT_SUPPORTED_ERROR);
      }
    });

    test('should build importStudentsSiecle url from organizationId and format', async function (assert) {
      // when
      await adapter.importStudentsSiecle(1, [csvFile], acceptedFormat);

      // then
      assert.ok(
        adapter.ajax.calledWith(
          'http://localhost:3000/api/organizations/1/schooling-registrations/import-siecle?format=csv',
          'POST'
        )
      );
    });
  });
});
