
# Service


## En résumé

* Créer un service est légitime si la logique implique plusieurs modèles et que
  la logique n'a pas à être positionnée dans un modèle
* Un service est stateless


## Détails

On utilise un service quand on veut partager une fonctionnalité entre plusieurs
usecases et/ou que la fonctionnalité ne doit pas être implémentée dans un objet
métier (domaine) plutôt que dans un autre (exemple de la fonction de virement
d'un compte en banque vers un autre qui doit être implémentée dans un service et
non pas dans un compte en banque car notamment un compte en banque A n'a pas de
raison d'avoir les droits pour manipuler un compte en banque B).

Un service est stateless.


## Rérérences

DDD Chapter 7: Services
Often the best indication that you should create a Service in the domain
model is when the operation you need to perform feels out of place as a method
on an Aggregate or a Value Object.



