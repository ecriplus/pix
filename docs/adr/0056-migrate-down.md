# 56. Rollbacks et Migrate Down

Date : 2025-03-11

## État

En cours d'amendement.

## Contexte

Dans tout ce document, les migrations évoquées sont des migrations ayant vocation à changer le schéma des bases de données et des données impactées le cas échéant.
Toute modification de données pour des besoins autres que l'évolution des schémas des bases de données (reprise de données, backfill, etc.) doivent faire l'objet de scripts en dehors des migrations.
Nous souhaitons clarifier les procédures de rollback sur l'environnement production (retour en arrière de version classiquement).
Nous préférons privilégier l'application d'un patch en production pour résoudre un incident, il peut être nécessaire de faire un rollback de version, selon la nature de l'incident.
Dans le contexte actuel, l'application d'un patch est une opération longue (25 minutes minimum). Une semi-automatisation permettrait d'amoindrir ce délai et de préférer cette solution au rollback de version dans certains cas.

Les rollbacks de versions ne contenant pas de migration peuvent être effectués aujourd'hui en production. Pour cela, on redéploie la version précédente sur toutes les apps simultanément.

Concernant les versions avec migration de données, le rollback est plus dangereux :

- risque de perte de données,
- un ordre d’exécution incertain pouvant causer des deadlocks,
- incertitude quant à la qualité des « down » développés (pas toujours écrits, pas de tests, pas de validation),
- nécessité de synchroniser avec les responsables des différents incréments pour s’assurer que tout va bien se passer,
- nécessité de bloquer les recettes potentielles en cours et corriger l'environnement de recette avant de refaire une mise en production (MEP).

A l'avenir, le déploiement continu permettra de résoudre une partie des problèmes rencontrés et de limiter les risques.
Dans le contexte d’aller vers du déploiement plus continu, l’effort à mettre transite ainsi vers notre rapidité à mettre en production.
Le lien entre les captains et les équipes de dev reste essentiel, en cas de soucis les équipes doivent rester alerte pour prévenir de leurs incertitudes au plus tôt. Côté captains il faut continuer à bien remonter les alertes pour créer cet échange le plus rapidement possible.

### Décision

**Résumé**

1. 1 PR = 1 migration
2. Pas de modification de code dans une PR de migration
3. Les migrations doivent être rétrocompatibles (le code doit continuer de fonctionner avant et après les migrations)
4. Les PRs de migration critiques doivent être revues par les captains

**Description**

Après discussion en équipe, les captains proposent les préconisations suivantes :

- Une migration doit faire l'objet d'une PR dédiée, qui ne contiendra que la migration. Le code utilisant le nouveau schéma (table ou colonne) doit être ajouté dans une autre PR, laquelle sera idéalement sera déployée dans une version différente de la version contenant PR de migration.
- Séparer le code pour pouvoir revert plus facilement l’une ou l’autre.

  Ce code doit donc être donc rétrocompatible.
  (Idéalement, avoir une MEP échelonnée elles sont dans deux MEP différentes)

- Les captains sont au courant au plus tôt => On aimerait être reviewer de tous les scripts de migration
- Nos précos pour les scripts de migration

  - On ne développe pas de migrate down

    les scripts de migrations doivent être Idempotent,

    pas de modification de type,
    ( si on doit changer un type de donnée, on créer une deuxième colonne avec le bon type, on transfère / transforme les datas et on supprime la première colonne.)

    pas de pertes ni modifications de données (=> écrire un script différent dans ce cas, qui nécessitera une intervention captains, hors phase de mise en production)

    La clause default sur le create/alter table est autorisée.

**Avantage(s):**

- Possibilité de mitiguer rapidement un incident en exécutant des rollbacks en production.
- Pas de risque de perte de données sur un rollback.

**Inconvénient(s):**

- Risque de délai supplémentaire pour les PR avec migration.

## Conséquences

- Arrêt de dev des scripts de migrate down
- Le code développé doit toujours être compatible avant/après qu'une migration soit appliquée
- Suppression des scripts `db:rollback:latest` et `datamart:rollback:latest`.
