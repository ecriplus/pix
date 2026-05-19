# Platform Anatomy

## General code organisation

The Pix applications (Pix API, Pix App, Pix Orga, Pix Certif and Pix Admin) are organised within a [monorepo](https://en.wikipedia.org/wiki/Monorepo) Git repository.

```
pix                      → Platform sources
 └ .circleci             → CircleCI configuration directory
    └ config.yml         → Main CircleCI configuration file
 └ admin                 → Pix Admin application sources
 └ api                   → Pix API application sources
 └ certif                → Pix Certif application sources
 └ docs                  → Technical and methodological documents directory
    └ adr                → ADR registry (Architecture Decision Records)
    └ assets             → Images used in the documentation
 └ high-level-tests      → Very high-level tests directory
    └ e2e                → Functional tests with Cypress.js
    └ load-testing       → Load and performance tests Artillery.io
 └ mon-pix               → Pix App application sources
 └ node_modules          → (generated) Dependencies for general NPM scripts and tasks
 └ orga                  → Pix Orga application sources
 └ scripts               → Various scripts used for operations and support
 └ .adr-dir              → Configuration file for the npryce/adr-tools tool to manage ADRs
 └ .buildpacks           → Scalingo buildpacks definition file
 └ .editorconfig         → Configuration file for the EditorConfig tool/standard
 └ .eslintrc.cjs        → General configuration file for the ESLint linting tool
 └ .gitignore            → List of files/directories to ignore from Git
 └ .slugignore           → List of files/directories that Scalingo should ignore at build time
 └ CHANGELOG.md          → List of changes made to the platform (automatically updated)
 └ compose.yaml          → File used for development to start a prod-equivalent environment
 └ INSTALLATION.md       → Instructions for installing the platform locally
 └ LICENSE.md            → Text of the software licence used on Pix (AGPL-3.0)
 └ nginx.conf.erb        → Reverse proxy / API gateway configuration file (Nginx)
 └ package.json          → Generated platform definition file
 └ package-lock.json     → Dependency listing
 └ README.md             → Project presentation file
 └ scalingo.json         → Scalingo Review Apps configuration file
```


## Anatomy of an Ember application

See [Ember official documentation](https://guides.emberjs.com/release/getting-started/anatomy-of-an-ember-app/)


## Anatomy of the Pix API application

The Pix API application code is inspired by the principles formulated by Robert C. Martin in his [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) model.

```
api                                 → Pix API application sources
 └ bin                              → Binaries directory
    └ www                           → API execution binary
 └ db                               → Database configuration and seeding files
    └ migrations                    → Database migration files directory
    └ seeds                         → Database seeding files directory for local development
    └ knex-database-connection.js   → Configuration file for the SQL querying tool (Knex.js)
    └ knexfile.js                   → Knex environments configuration file
 └ lib                              → API sources
    └ application                   → HTTP route and controller definition files
    └ domain                        → Domain objects (entities, aggregates, value objects, services, use cases)
       └ models                     → Domain entities, aggregates and value objects
       └ services                   → Domain business services
       └ usecases                   → Business use cases
       └ validators                 → Functional rules validators
       └ constants.js               → List of business variables used in the application
       └ errors.js                  → List of business errors
    └ infrastructure                → All technical modules and building blocks
       └ adapters                   → Converters from data source objects (PG, Airtable) to domain objects
       └ caches                     → Classes and modules used for data caching
       └ data                       → Bookshelf data models
       └ datasources                → Airtable data models
       └ files                      → File templates used for data import/export
       └ mailers                    → Classes and modules used for sending emails
       └ plugins                    → (deprecated) Home-made Hapi.js plugins
       └ repositories               → Data access managers (PG, Airtable)
       └ serializers                → Domain objects ←→ HTTP request objects data converters
       └ utils                      → Utility classes, modules and helpers
       └ validators                 → (deprecated) Technical validators
       └ airtable.js                → Airtable client wrapper
       └ bookshelf.js               → Bookshelf manager instance
       └ logger.js                  → Bunyan logger instance
 └ node_modules                     → (generated) Dependencies for general NPM scripts and tasks
 └ scripts                          → Various scripts
 └ tests                            → Test suite and test case sources
    └ acceptance                    → High-level tests for scripts and certain routes
    └ docs                          → Tests documenting the usage of dependencies used on Pix (e.g. Bookshelf)
    └ integration                   → Tests used to cover Routes, Bookshelf models, Repositories, and file processing
    └ tooling                       → Useful tooling (Factories, DataBuilders) for tests
    └ unit                          → Unit tests (Controllers, Serializers, Models, Domain Services and Usecases, Validators, etc.)
    └ .eslintrc.cjs                → General configuration file for the ESLint linting tool
    └ test-helper.js                → Configuration module for libs used in tests (Mocha, Sinon, Chai, etc.)
 └ .buildpacks                      → Scalingo buildpacks definition file
 └ .env                             → (generated/edited) File with environment variables for local development
 └ .eslintrc.cjs                   → General configuration file for the ESLint linting tool
 └ .istanbul.yml                    → Configuration file for code coverage
 └ .slugignore                      → List of files/directories that Scalingo should ignore at build time
 └ package.json                     → Generated platform definition file
 └ package-lock.json                → Dependency listing
 └ Procfile                         → Scalingo container startup file
 └ sample.env                       → Template for the .env file
 └ server.js                        → Hapi.js web server instance
```
