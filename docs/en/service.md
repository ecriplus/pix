
# Service


## Summary

* Creating a service is legitimate when the logic involves several models and
  the logic should not be placed in a single model
* A service is stateless


## Details

A service is used when you want to share functionality across several
use-cases and/or when the functionality must not be implemented in one
domain object rather than another (e.g. a bank transfer function
from one account to another must be implemented in a service and
not in a bank account, notably because bank account A has no
reason to have the rights to manipulate bank account B).

A service is stateless.


## References

DDD Chapter 7: Services
Often the best indication that you should create a Service in the domain
model is when the operation you need to perform feels out of place as a method
on an Aggregate or a Value Object.
