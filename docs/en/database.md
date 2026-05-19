
# Database


## Conventions

These conventions are verified as much as possible in the API `lint` task.


## Naming

### Tables

A table name:

- is plural: `users` not `user`
- is lowercase and may contain underscores (`_`), but not dashes (`-`),
  following the [PostgreSQL recommendation](https://wiki.postgresql.org/wiki/Don%27t_Do_This#Don.27t_use_upper_case_table_or_column_names)

Databases are not used exclusively by the API, and when running
tests, debugging or simply querying for information, having to use
double quotes has a significant impact on productivity.

Good:
```
client_applications
lti_platform_registrations
```

Not good:
```
wonder-assets
wonder_asset
wonderAssets
```


#### Exceptions

Possible exceptions are:

- existing legacy tables (`organization-learners`,
  `certification-centers`, `user-logins`, etc.)
- tables used by libraries, for example the `knex_migrations_lock` table used by the `knex` library;
- tables containing only a single record (no known example).

In these cases, they can be added to the `ignores` property
of the [configuration file](../api/tests/acceptance/database/configuration.js).

```javascript
  ignores: [
  {identifierPattern: 'public\\.knex*.*', rulePattern: '.*'},
  {identifierPattern: 'public\\.badge-criteria', rulePattern: 'name-inflection'},
]
```

##### History

In Pix's early days, the developers wanted to be disruptive by using
dashes (`-`), and for a long time no one questioned this decision.
