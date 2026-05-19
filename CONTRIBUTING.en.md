# Contributing to Pix

The GitHub organization [1024pix](https://github.com/1024pix) hosts the code used in the [Pix](https://pix.fr) project. The organization's GitHub repositories are rapidly evolving and developed by several dedicated teams at Pix. The GitHub repository [1024pix/pix](https://github.com/1024pix/pix) is the canonical source for our teams. The developments we carry out are exclusively dedicated to improving the [Pix](https://pix.fr) platform, and we are not currently working on a generic version usable by everyone for other purposes.

This means we cannot promise that external contributions will be on equal footing with internal ones. Code reviews take time, and work needed for Pix is prioritized. We also cannot promise that we will accept all feature contributions. Even if the code is already written, reviews and maintenance have a cost. Within Pix, we have a product management team that carefully evaluates which features we should offer or not, and many internally generated ideas are ultimately not retained.

For any contribution, it is essential to respect *at minimum* the following points.

## Code of Conduct for Reporting Issues

Always use [https://github.com/1024pix/pix/issues](https://github.com/1024pix/pix/issues) to report issues.

## Code of Conduct for Opening a Pull Request

### Format

The format to follow is: `[<TAG>] <DESCRIPTION> (<US_ID>).`, e.g.: "[FEATURE] Create accounts (PIX-987)."

### TAG

Name | Usage
--- | ---
FEATURE | PR related to a story
BUGFIX | PR related to a bug fix
TECH | PR related to technical / infrastructure code
BUMP | PR related to version upgrades

This tag allows us to automatically generate a [CHANGELOG.md](./CHANGELOG.md) file grouping changes from one version to the next. Other tags can be used, but the CHANGELOG will group them as "Other" changes.

In particular, under Others, you may find:

Name | Usage
--- | ---
DOC | PR related to documentation
POC | PR related to Proofs of Concept, must not be merged

The original PR title (and therefore its tag) always remains displayed in each line of the CHANGELOG.

### DESCRIPTION

The US description must be written in French, as this is a French-speaking product.
Furthermore, we want the CHANGELOG to be understandable by non-technical stakeholders, such as users.

We follow the convention that the description should work as the end of the sentence `Once merged, this _pull request_ will allow…`.

#### Bad Examples

> [!CAUTION]
> Serialise all badgeParnerCompetences
>
> ADR proposal to separate Domain Transactions and Domain Events

#### Good Examples

> [!TIP]
> Serialize all badgeParnerCompetences
>
> Propose an ADR to separate Domain Transactions and Domain Events

### `US_ID`

`US_ID` corresponds to the unique story identifier in the Product Backlog, generated and managed by our ticket management system.
Leave empty if there is no associated ticket.
Currently, the format of this `US_ID` is `PIX-Number`.

If the PR is linked to a GitHub Issue, `US_ID` is then `ISSUE-#`.

If the PR is not linked to any ticket or issue, the PR title format is `[<TAG>] <DESCRIPTION>.` without `US_ID`.

## Local Development Environment Setup

See [INSTALLATION](INSTALLATION.en.md)

## Naming Conventions

### Applications

Application names follow this pattern: `<Pix [activity_shortname]>`
E.g.: "Pix App", "Pix Admin", "Pix Orga", "Pix API", "Pix Certif"

### Commits

Commit messages must be written in English (team decision from 27/04/2017).

50 characters maximum to comply with ecosystem conventions, notably GitHub.

Capitalize and use an action verb to align with Git conventions.

If the message is not 100% self-explanatory, a description can be added (after a blank line) explaining the motivation for the commit.

We follow the convention that the subject should work as the end of the sentence `If applied, this commit will… `.

The use of `Conventional Commits` specifications is currently recommended, but not yet generalized across all commits.

> A properly formed Git commit subject line should always be able to complete the following sentence:
>
>     If applied, this commit will _Your subject line here_
>
> For example:
>
>     If applied, this commit will _Refactor subsystem X for readability_
>     If applied, this commit will _Update getting started documentation_
>     If applied, this commit will _Remove deprecated methods_
>     If applied, this commit will _Release version 1.0.0_
>     If applied, this commit will _Merge pull request #123 from user/branch_

To go further:

- [Commit messages guide](https://github.com/RomuloOliveira/commit-messages-guide/blob/master/README.md)
- [Git SCM commit guidelines](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#_commit_guidelines)
- https://chris.beams.io/posts/git-commit/
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

### Branches

Format (\*) | Description | Examples
--- | --- | ---
`[us_id]-[description]` | Branch for story development | pix-123-create-account
`[us_id]-bugfix-[description]` | Branch for bug fixing | pix-124-bugfix-timeout-ko
`[us_id]-cleanup-[description]` | Branch for refactoring | pix-125-cleanup-add-tests
`[us_id]-infra-[description]` | Branch for technical/infrastructure code | pix-126-infra-backup-db
`[us_id]-doc-[description]` | Branch related to documentation (code or README) | pix-127-doc-readme-live
`[us_id]-hotfix-[description]` | Branch for production bug fixes | pix-128-hotfix-regression
`tech-[description]` | Branch with technical changes | tech-upgrade-cicd-script
`tech-adr-[description]` | Branch adding an ADR | tech-adr-browser-supports

(\*): the description is in English

## Pull Request Validation Rules

For a pull request to be accepted and merged, the following conditions must be met:

- all CI checks must be green: applications have been deployed, tests have passed;
- the PR description must be complete: Problem, proposal, notes, testing instructions;
- the PR has received enough *approvals*

The number of expected validations may vary slightly depending on the case:

- By default, **3 people** must have reviewed the code. So for a contributor, 2 *approvals* will be required for each PR.
- If the PR was developed by multiple people, at least 1 *approval* is needed beyond the participants. If the team is not large enough: the 2 *approvals* can be given by the participants themselves — we strongly recommend not merging immediately after development and reviewing your own PR with fresh eyes.
- If the PR involves multiple teams, then 1 *approval* per team involved is required. This rule is in addition to the 2 *approvals* rule.


## Other

### `dev` branch

⚠️ We never merge `dev` into another branch ⚠️

### Node.js

We only commit `package-lock.json` when `package.json` has been modified.
