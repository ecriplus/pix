
# Repository


## Summary

* A repository is an abstraction layer above data persistence
* A repository must contain as little business logic as possible (be as "dumb" as possible)
* A repository must not perform security checks


## Details

The Repository design pattern allows hiding the persistence choice. The code
that uses the repository must not know whether a relational database
or a cache is being used, for example. The goal is to allow changing
the persistence choices without having to change the code that depends on the
repositories. To achieve this goal, a repository's interface must be
independent of the technical layer.

Repositories are an abstraction to hide the issues and
choices related to data persistence. A simple representation that shows
the intent of a repository is that of a collection. You can add elements,
remove them or retrieve them. The idea is that you retrieve an
object from the repository, modify it and then save the changes.

If using an existing repository does not fully meet the
business need, it is preferable to create a separate repository rather than injecting an
existing one.

A repository is not intended to perform security checks.
