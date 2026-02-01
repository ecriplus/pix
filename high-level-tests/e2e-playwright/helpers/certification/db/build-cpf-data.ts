import { Knex } from 'knex';

export async function buildCpfData(knex: Knex) {
  await knex('certification-cpf-countries').insert({
    code: '99100',
    commonName: 'FRANCE',
    originalName: 'FRANCE',
    matcher: 'ACEFNR',
  });
  await knex('certification-cpf-cities').insert({
    name: 'PERPIGNAN',
    postalCode: '66000',
    INSEECode: '66136',
    isActualName: true,
  });
}
