import { getModulesListAsCsv } from '../../../../scripts/modulix/get-modules-csv.js';
import { ModuleFactory } from '../../../../src/devcomp/infrastructure/factories/module-factory.js';
import { expect } from '../../../test-helper.js';
import moduleContent from './test-module.json' with { type: 'json' };

describe('Acceptance | Script | Get Modules as CSV', function () {
  it(`should return modules list as CSV`, async function () {
    // Given
    const modulesListAsJs = [ModuleFactory.build(moduleContent)];

    // When
    const modulesListAsCsv = await getModulesListAsCsv(modulesListAsJs);

    // Then
    expect(modulesListAsCsv).to.be.a('string');
    expect(modulesListAsCsv).to
      .equal(`\ufeff"Module"\t"ModuleSlug"\t"ModuleLevel"\t"ModuleLink"\t"ModuleTotalGrains"\t"ModuleTotalActivities"\t"ModuleTotalLessons"\t"ModuleDuration"\t"ModuleTotalElements"
"6282925d-4775-4bca-b513-4c3009ec5886"\t"bac-a-sable"\t"Débutant"\t"https://app.recette.pix.fr/modules/bac-a-sable"\t11\t4\t2\t"=TEXT(5/24/60; ""mm:ss"")"\t19`);
  });
});
