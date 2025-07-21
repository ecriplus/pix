# Conventions

Ces conventions sont vérifiées autant que possible dans la tâche de `lint` de l'API.


## Nommage

### Tables

Le nom d'une table :

- est au pluriel : `users` et pas `user`
- est en minuscules et peut contenir des soulignés (underscore), c’est à dire
  `_`, mais pas des tirets (dash), c’est à dire `-`,
  suivant la [préconisation de PostgreSQL](https://wiki.postgresql.org/wiki/Don%27t_Do_This#Don.27t_use_upper_case_table_or_column_names)

Les bases de données ne servent pas uniquement à l’API et lorsqu’on doit faire
des tests, du debug ou tout simplement des requêtes pour chercher des
informations mettre des guillemets (double quotes) impacte énormément la
productivité.

Bon :
```
client_applications
lti_platform_registrations
```

Pas bon :
```
wonder-assets
wonder_asset
wonderAssets
```


#### Exceptions

Les exceptions possibles sont :

- les anciennes tables déjà existantes (`organization-learners`,
  `certification-centers`, `user-logins`, etc.)
- les tables utilisées par les librairies, par exemple la table `knex_migrations_lock` utilisée par la librairie `knex`;
- les tables ne contenant qu'un seul enregistrement (aucun exemple connu).

Dans ce cas, elles peuvent être ajoutées à la propriété `ignores`
du [fichier de configuration](../api/tests/acceptance/database/configuration.js).

```javascript
  ignores: [
  {identifierPattern: 'public\\.knex*.*', rulePattern: '.*'},
  {identifierPattern: 'public\\.badge-criteria', rulePattern: 'name-inflection'},
]
```

##### Historique

Aux débuts de Pix les développeurs ont voulu être disruptifs en utilisant des
tirets (dash), c’est à dire `-`, et pendant longtemps personne n’a remis en
cause cette décision

