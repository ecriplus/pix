# 61. Documentation tables, colonnes et migration de base de données

Date : 2025-10-15

## État

En cours de rédaction

## Contexte

La base de données actuelle contient des commentaires de description (par exemple dans les tables, colonnes, vues, etc.) rédigés dans deux langues : le français et l’anglais.
Étant donné que le projet Pix est open source et que sa vocation est de le rester, il est essentiel que la documentation et les métadonnées soient accessibles à la plus grande communauté possible, y compris aux contributeurs non francophones.

Aujourd’hui, cette mixité linguistique peut créer une barrière pour les contributeurs internationaux et nuit à la cohérence globale du code et de la documentation.

## Solutions envisagées

### Solution 1 : documentation en français

Avoir une documentation des tables en français

#### Avantages

- Même vocabulaire utilisé par les développeurs
- Compréhension fine des définitions (langue maternelle des développeurs et maîtrise de ses subtilités)
- Rapidité à écrire la documentation (pas d'effort de traduction)

#### Inconvénients

- Ne correspond pas à la stratégie de Pix (ouverture vers l'Europe et le Monde)
- Freine la compréhension de la codebase par le monde open source (la population francophone ne représente que 4.2% de la population mondiale)
- Invite à l'usage du [sociolecte](https://fr.wikipedia.org/wiki/Sociolecte) (vocabulaire interne de Pix) et à des définitions écrites en langue locale (fr-FR)

### Solution 2 : documentation en anglais

#### Avantages

- Correspond à la stratégie de Pix (ouverture Europe et Monde)
- Compréhension plus large à l'international (la population anglophone représente 20% de la population mondiale)
- Même langue entre le code et les définitions, en accord avec le Langage Ubiquitaire
- Invite à la vulgarisation et à l'usage d'un vocabulaire plus inclusif (le [sociolecte](https://fr.wikipedia.org/wiki/Sociolecte) de Pix n'ayant pas forcément d'équivalent en anglais)

#### Inconvénients

- Nécessite un effort de traduction lors de la rédaction de la documentation
- Nécessite un effort de lecture pour comprendre une rédaction anglaise dans le [sociolecte](https://fr.wikipedia.org/wiki/Sociolecte) Pix

## Solution retenue : documentation en anglais

Nous aimerions que tous les commentaires de description présents dans la base de données soient rédigés exclusivement en anglais et avec une orientation la plus fonctionnelle et vulgarisée possible.
Cela inclut notamment :

- Les descriptions de tables et de colonnes.
- Les fichiers de migration ou de définition du schéma contenant ces descriptions.

Les futures contributions au projet devront également respecter cette règle afin de garantir la cohérence linguistique dans le temps.

Cependant, les tables dites "privées", par exemple celles servant à l'équipe data ne faisant pas partie de la codebase open source de Pix, peuvent rester écrites en français pour des raisons de facilité de traduction de certaines notions.

## Conséquences

- Une phase de migration devra être réalisée pour traduire les commentaires existants du français vers l’anglais.
- Des règles de contribution (CONTRIBUTING.md) ou un linter de schéma pourront être mis en place pour éviter toute régression linguistique.
- Les relectures de code devront inclure la vérification de la langue des descriptions.
