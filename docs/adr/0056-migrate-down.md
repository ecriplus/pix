# 56. Rollbacks et Migrate Down

Date : 2025-03-11

## État

Accepté

## Contexte

Dans tout ce document, les migrations évoquées sont des migrations ayant vocation à changer le schéma des bases de données et des données impactées le cas échéant.
Toute modification de données pour des besoins autres que l'évolution des schémas des bases de données (reprise de données, backfill, etc.) doivent faire l'objet de scripts en dehors des migrations.
Nous souhaitons clarifier les procédures de rollback sur l'environnement production (retour en arrière de version classiquement).
Même si nous préférons privilégier l'application d'un patch en production pour résoudre un incident, il peut être nécessaire de faire un rollback de version, selon la nature de l'incident.
Dans le contexte actuel, l'application d'un patch est une opération longue (25 minutes minimum). Une semi-automatisation permettrait d'amoindrir ce délai et de préférer cette solution au rollback de version dans certains cas.

Les rollbacks de versions ne contenant pas de migration peuvent être effectués aujourd'hui en production. Pour cela, on redéploie la version précédente sur toutes les apps simultanément.

Concernant les versions avec migration de données, le rollback est plus dangereux :

- risque de perte de données,
- un ordre d’exécution incertain pouvant causer des deadlocks,
  - knex semble se baser sur le nom de fichier plutôt que sur ses tables PG internes qui tracent l'ordre d'exécution effectif...
  - dans ce cas, on peut exécuter manuellement les requêtes knex dans l'ordre qu'on souhaite.
- incertitude quant à la qualité des « down » développés (pas toujours écrits, pas de tests, pas de validation),
- nécessité de synchroniser avec les responsables des différents incréments pour s’assurer que tout va bien se passer,
- nécessité de bloquer les recettes potentielles en cours et corriger l'environnement de recette avant de refaire une mise en production (MEP).

A l'avenir, le déploiement continu permettra de résoudre une partie des problèmes rencontrés et de limiter les risques.
Dans le contexte d’aller vers du déploiement plus continu, l’effort à mettre transite ainsi vers notre rapidité à mettre en production.
Le lien entre les captains et les équipes de dev reste essentiel, en cas de soucis les équipes doivent rester alerte pour prévenir de leurs incertitudes au plus tôt. Côté captains il faut continuer à bien remonter les alertes pour créer cet échange le plus rapidement possible.

## Approches

Dans tous les cas de figure, on souhaite mieux formaliser notre approche des migrations pour aller dans la direction du déploiement continu.

### La roue de secours

Lorsqu'un incident survient en production, l'objectif premier est de rétablir la situation pour que les utilisateurs soient le moins possible impactés.
Dans la majorité des cas de figure, revenir sur une version précédente (rollback) ou rétablir l'environnement antérieur est suffisant.

L'exécution des "down" est un dernier recours.

Dans un monde idéal, cette roue de secours ne doit bien sûr être appliquée qu'en accord avec l'équipe en charge de la fonctionnalité. Si l'équipe n'est pas disponible, il convient à l'équipe captains de tout faire pour rétablir la situation et donc d'appliquer ce "down".

**Avantage(s):**

- Possibilité de mitiguer rapidement (< 25 minutes) un incident en exécutant des rollbacks **complets** en production.
- Copier/coller facile en cas de rollback unitaire.

**Inconvénients:**

- Demande plus de rigueur sur la création de migrations, en particulier pour valider leur idempotence.
- Risque de délai supplémentaire pour le développement de nouvelles fonctionnalités.
- Si on remonte trop dans le temps, il y a un monde où on peut perdre des données. (d'où l'intérêt de bien découper les chantiers)

### Arrêter les migrate "down"

D'un autre côté, vu que les "down" ne sont pratiquement pas joués, l'effort a mettre dessus est remis en question par les équipes de dev.

Une approche alternative serait d'arrêter de les développer pour ne faire que des migrations dans le sens "up".

En cas de soucis de données, il conviendrait donc de développer une nouvelle migration qui suivra le processus habituel de validation puis de livraison.

**Avantage(s):**

- Possibilité de mitiguer rapidement un incident en exécutant des rollbacks **incomplets** en production.
- Aucun de risque de perte de données sur un rollback.

**Inconvénient(s):**

- Si un incident est causée par une migration, le hotfix sera lent (minimum 25 minutes à date).
- Perte de la roue de secours en cas de coup dur sur le moment.
- Risque de délai supplémentaire pour le développement de nouvelles fonctionnalités.

## Décision

On souhaite à date conserver la roue de secours en cas de coup dur.

### Résumé

1. 1 PR = 1 migration
2. Pas de modification de code dans une PR de migration
3. Les migrations doivent être idempotentes (up -> down -> up doit fonctionner)
   - il y a un sujet de validation automatique de ce point
4. Les migrations doivent être rétrocompatibles (le code doit continuer de fonctionner avant et après les migrations)
5. Les PRs de migration critiques doivent être revues par les captains

### Description

Après discussion en équipe, les captains proposent les préconisations suivantes :

- Une migration doit faire l'objet d'une PR dédiée, qui ne contiendra que la migration. Le code utilisant le nouveau schéma (table ou colonne) doit être ajouté dans une autre PR, laquelle sera idéalement sera déployée dans une version différente de la version contenant PR de migration.
- Séparer le code pour pouvoir revert plus facilement l’une ou l’autre.

  Les migrations et le code doivent donc être donc rétrocompatible.
  (Idéalement, avoir une MEP échelonnée elles sont dans deux MEP différentes)

- Les captains sont au courant au plus tôt => On aimerait être reviewer de tous les scripts de migration
- Nos précos pour les scripts de migration

  - Les migrates "down" sont obligatoires

    on peut en avoir besoin même si on les fait manuellement, c’est une aide précieuse.

    dans des cas marginaux ils ne sont pas utiles : migration très lente (passage par un script à part), suppression de colonne/table.

  - On doit être capable de migrate up => migrate down => migrate up

    Donc les scripts de migrations doivent être Idempotent,

    pas de modification de type,
    ( si on doit changer un type de donnée, on créer une deuxième colonne avec le bon type, on transfère / transforme les datas et on supprime la première colonne.)

    pas de pertes ni modifications de données (=> écrire un script différent dans ce cas, qui nécessitera une intervention captains, hors phase de mise en production)

    La clause default sur le create/alter table est autorisée.

## Conséquences

- Le code développé doit toujours être compatible avant/après qu'une migration soit appliquée.
- Il peut arriver en dernier recours qu'un migrate "down" soit joué en production.

## Sources

- [Pourquoi et comment gérer la compatibilité ascendante ?](https://techblog.deepki.com/retrocompat/)
